import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spacing, FontSize, BorderRadius, useAppTheme, cardStyle, sectionTitleStyle } from '../theme';
import { Chip } from './Chip';
import { Icon } from './Icon';
import { SITE_URL } from '../lib/site';
import {
  ASSISTANT_CONSENT_KEY,
  ASSIST_MAX_CHARS,
  ASSIST_MAX_USER_TURNS,
  actionLabel,
  askBaker,
  assistantEnabled,
  deviceTimeZone,
  isoWithOffset,
  planStepTitle,
  type AssistAction,
  type AssistContext,
  type AssistTurn,
} from '../lib/assist';
import type { LazyVessel } from '../lib/lazyMethod';

/** Same origin on the web; the full site URL elsewhere. */
const ASSIST_URL = Platform.OS === 'web' ? '/api/assist' : `${SITE_URL}/api/assist`;

const STARTERS = [
  { label: 'Plan for a time', text: 'I want bread ready by ' },
  { label: "Something's not right", text: 'My dough ' },
];

const BUSY_MESSAGE = 'The baker has answered a lot today. Try again tomorrow.';
const ERROR_MESSAGE = "Couldn't get an answer. The steps on this page still apply.";

/** Set when the service is unconfigured or unreachable: hide for the rest of the session. */
let hiddenThisSession = false;

interface Props {
  /** What the page shows now; `now` and `timeZone` are added at send time. */
  context: Omit<AssistContext, 'now' | 'timeZone'>;
  onSetRoomTemp: (roomTempC: number) => void;
  onSetFormula: (change: { waterPct?: number; starterPct?: number; saltPct?: number }) => void;
  onSetVessel: (vessel: LazyVessel) => void;
  onResetClock: () => void;
}

interface Exchange {
  question: string;
  reply: string;
  actions: AssistAction[];
  applied: boolean[];
}

function useOnline(): boolean {
  const [online, setOnline] = useState(() => Platform.OS !== 'web' || typeof navigator === 'undefined' || navigator.onLine !== false);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const update = () => setOnline(navigator.onLine !== false);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}

/**
 * "Ask the baker": an optional, consent-gated question box on the bread page.
 * The conversation lives in component state only and is never saved.
 */
export function AskCard({ context, onSetRoomTemp, onSetFormula, onSetVessel, onResetClock }: Props) {
  const { colors, unitSystem } = useAppTheme();
  const online = useOnline();
  const inputRef = useRef<TextInput>(null);
  const [hidden, setHidden] = useState(hiddenThisSession);
  const [question, setQuestion] = useState('');
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [consented, setConsented] = useState<boolean | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ASSISTANT_CONSENT_KEY)
      .then((v) => setConsented(!!v))
      .catch(() => setConsented(false));
  }, []);

  const send = useCallback(async () => {
    const text = question.trim();
    if (!text || waiting) return;
    setMessage(null);
    setWaiting(true);
    const history: AssistTurn[] = exchanges.flatMap((e) => [
      { role: 'user' as const, text: e.question },
      { role: 'assistant' as const, text: e.reply },
    ]);
    const outcome = await askBaker(
      ASSIST_URL,
      { ...context, now: isoWithOffset(new Date()), timeZone: deviceTimeZone() },
      [...history, { role: 'user', text }],
    );
    setWaiting(false);
    switch (outcome.kind) {
      case 'answer':
        setExchanges((prev) => [...prev, {
          question: text,
          reply: outcome.response.reply,
          actions: outcome.response.actions,
          applied: outcome.response.actions.map(() => false),
        }]);
        setQuestion('');
        break;
      case 'busy':
        setMessage(BUSY_MESSAGE);
        break;
      case 'hide':
        hiddenThisSession = true;
        setHidden(true);
        break;
      default:
        setMessage(ERROR_MESSAGE);
    }
  }, [question, waiting, exchanges, context]);

  const onSendPress = useCallback(() => {
    if (!question.trim() || waiting) return;
    if (!consented) {
      setShowConsent(true);
      return;
    }
    send();
  }, [question, waiting, consented, send]);

  const acceptConsent = useCallback(() => {
    AsyncStorage.setItem(ASSISTANT_CONSENT_KEY, new Date().toISOString()).catch(() => {});
    setConsented(true);
    setShowConsent(false);
    send();
  }, [send]);

  const applyAction = useCallback((exchangeIndex: number, actionIndex: number) => {
    const action = exchanges[exchangeIndex]?.actions[actionIndex];
    if (!action) return;
    switch (action.type) {
      case 'set_room_temp': onSetRoomTemp(action.roomTempC); break;
      case 'set_formula': onSetFormula({ waterPct: action.waterPct, starterPct: action.starterPct, saltPct: action.saltPct }); break;
      case 'set_vessel': onSetVessel(action.vessel); break;
      case 'reset_clock': onResetClock(); break;
      case 'show_plan': return;
    }
    setExchanges((prev) => prev.map((e, i) => (i === exchangeIndex
      ? { ...e, applied: e.applied.map((a, j) => a || j === actionIndex) }
      : e)));
  }, [exchanges, onSetRoomTemp, onSetFormula, onSetVessel, onResetClock]);

  const startOver = useCallback(() => {
    setExchanges([]);
    setQuestion('');
    setMessage(null);
  }, []);

  const applyStarter = useCallback((text: string) => {
    setQuestion(text);
    setShowConsent(false);
    // Focus after the value lands so the cursor sits at the end.
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  if (!assistantEnabled() || !online || hidden) return null;

  const turnsUsed = exchanges.length;
  const canAsk = turnsUsed < ASSIST_MAX_USER_TURNS;
  const sendDisabled = waiting || !question.trim();

  return (
    <View style={[cardStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionTitleStyle, { color: colors.muted }]}>ASK THE BAKER</Text>

      {exchanges.map((e, i) => (
        <View key={i} style={styles.exchange}>
          <Text style={[styles.question, { color: colors.muted }]}>{e.question}</Text>
          <Text style={[styles.reply, { color: colors.espresso }]}>{e.reply}</Text>
          {e.actions.map((action, j) => {
            if (action.type === 'show_plan') {
              return (
                <View key={j} style={[styles.plan, { borderColor: colors.border, backgroundColor: colors.successBg }]}>
                  {action.plan.steps.map((step) => {
                    const at = new Date(step.at);
                    if (isNaN(at.getTime())) return null;
                    return (
                      <Text key={step.key} style={[styles.planRow, { color: colors.espresso }]}>
                        {planStepTitle(step.key)}
                        {' · '}
                        {at.toLocaleDateString([], { weekday: 'short' })}{' '}
                        {at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </Text>
                    );
                  })}
                </View>
              );
            }
            const applied = e.applied[j];
            return (
              <TouchableOpacity
                key={j}
                onPress={() => applyAction(i, j)}
                disabled={applied}
                accessibilityRole="button"
                accessibilityState={{ disabled: applied }}
                style={[styles.actionBtn, {
                  borderColor: applied ? colors.border : colors.terracotta,
                  backgroundColor: applied ? colors.disabledBg : colors.white,
                }]}
              >
                <Text style={[styles.actionText, { color: applied ? colors.disabled : colors.terracotta }]}>
                  {applied ? 'Applied' : actionLabel(action, unitSystem)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {canAsk ? (
        <>
          {turnsUsed === 0 && (
            <View style={styles.chips}>
              {STARTERS.map((s) => (
                <Chip key={s.label} selected={false} role="button" label={s.label} onPress={() => applyStarter(s.text)}>
                  <Text style={[styles.chipText, { color: colors.espresso }]}>{s.label}</Text>
                </Chip>
              ))}
            </View>
          )}

          <Text style={[styles.inputLabel, { color: colors.espresso }]} nativeID="ask-question-label">Your question</Text>
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              value={question}
              onChangeText={setQuestion}
              multiline
              maxLength={ASSIST_MAX_CHARS}
              editable={!waiting}
              accessibilityLabel="Your question"
              accessibilityLabelledBy="ask-question-label"
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.white, color: colors.espresso }]}
            />
            <TouchableOpacity
              onPress={onSendPress}
              disabled={sendDisabled}
              accessibilityRole="button"
              accessibilityLabel="Send"
              accessibilityState={{ disabled: sendDisabled, busy: waiting }}
              style={[styles.sendBtn, { backgroundColor: colors.terracotta, opacity: sendDisabled ? 0.5 : 1 }]}
            >
              {waiting ? <ActivityIndicator color={colors.white} /> : <Icon name="send" size={20} color={colors.white} />}
            </TouchableOpacity>
          </View>

          {showConsent && (
            <View style={[styles.consent, { borderColor: colors.border, backgroundColor: colors.tipBg }]}>
              <Text style={[styles.consentText, { color: colors.espresso }]}>
                Your question and this loaf's formula, room temperature and mix time are sent to DeepSeek, an AI service based in China, to answer it. Nothing is saved to an account. Answers can be wrong; trust your dough.
              </Text>
              <View style={styles.consentButtons}>
                <TouchableOpacity
                  onPress={acceptConsent}
                  accessibilityRole="button"
                  style={[styles.consentBtn, { backgroundColor: colors.terracotta }]}
                >
                  <Text style={[styles.consentBtnText, { color: colors.white }]}>Ask</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowConsent(false)}
                  accessibilityRole="button"
                  style={[styles.consentBtn, styles.consentBtnOutline, { borderColor: colors.terracotta }]}
                >
                  <Text style={[styles.consentBtnText, { color: colors.terracotta }]}>Not now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity onPress={startOver} accessibilityRole="button" style={styles.textBtn}>
          <Text style={[styles.textBtnLabel, { color: colors.terracotta }]}>Start a new question</Text>
        </TouchableOpacity>
      )}

      {message && <Text style={[styles.message, { color: colors.muted }]} accessibilityLiveRegion="polite">{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  exchange: { gap: Spacing.sm, marginBottom: Spacing.md },
  question: { fontSize: FontSize.sm, fontStyle: 'italic', lineHeight: 20 },
  reply: { fontSize: FontSize.sm, lineHeight: 22 },
  plan: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, gap: 2 },
  planRow: { fontSize: FontSize.sm, lineHeight: 22 },
  actionBtn: { alignSelf: 'flex-start', borderWidth: 1.5, borderRadius: BorderRadius.md, minHeight: 44, paddingHorizontal: Spacing.md, justifyContent: 'center' },
  actionText: { fontSize: FontSize.sm, fontWeight: '700' },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  chipText: { fontSize: FontSize.sm, fontWeight: '600' },

  inputLabel: { fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.xs },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  input: { flex: 1, minHeight: 64, borderWidth: 1, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, fontSize: FontSize.md, textAlignVertical: 'top' },
  sendBtn: { width: 44, height: 44, minWidth: 44, minHeight: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },

  consent: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md, gap: Spacing.sm },
  consentText: { fontSize: FontSize.sm, lineHeight: 21 },
  consentButtons: { flexDirection: 'row', gap: Spacing.sm },
  consentBtn: { flex: 1, minHeight: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  consentBtnOutline: { borderWidth: 1.5 },
  consentBtnText: { fontSize: FontSize.md, fontWeight: '800' },

  textBtn: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  textBtnLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  message: { fontSize: FontSize.sm, lineHeight: 20, marginTop: Spacing.sm },
});
