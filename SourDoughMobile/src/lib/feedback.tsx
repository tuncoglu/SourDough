/**
 * Cross-platform user feedback: toasts, confirm dialogs, and alerts.
 *
 * Why this exists: react-native-web's `Alert.alert` is a no-op (its
 * implementation is literally an empty function), so every Alert-based
 * confirmation and notification silently died on the web build — deleting
 * recipes, resetting settings, and save/copy feedback all did nothing.
 *
 * This module replaces Alert everywhere with an in-app toast + a Modal-based
 * confirm dialog, both of which render identically on iOS, Android, and web.
 * `alert()` is kept as a thin wrapper that maps to a toast so existing call
 * sites read the same as before.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, FontSize, Spacing, useAppTheme } from '../theme';

type ToastKind = 'info' | 'success' | 'error';

interface ToastState {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ConfirmOptions {
  title: string;
  message: string;
  /** Label for the confirm button (defaults to "OK"). */
  confirmLabel?: string;
  /** Render the confirm button in the destructive (error) color. */
  destructive?: boolean;
}

interface FeedbackContextValue {
  /** Show a transient toast. Kind controls the background color. */
  showToast: (message: string, kind?: ToastKind) => void;
  /** Show a confirm dialog; resolves true if confirmed, false if cancelled. */
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  /** Alert-equivalent — maps to a toast (works on web + native). */
  alert: (title: string, message?: string, kind?: ToastKind) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [confirmState, setConfirmState] = useState<{
    opts: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);
  const toastId = useRef(0);

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, kind }]);
    // Auto-dismiss; keep a longer window for longer messages
    const delay = Math.max(2500, Math.min(6000, message.length * 60));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, delay);
  }, []);

  const alert = useCallback(
    (title: string, message?: string, kind: ToastKind = 'info') => {
      showToast(message ? `${title} — ${message}` : title, kind);
    },
    [showToast],
  );

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ opts, resolve });
    });
  }, []);

  const handleAnswer = useCallback((value: boolean) => {
    setConfirmState((state) => {
      state?.resolve(value);
      return null;
    });
  }, []);

  // Stable value so toast push/dismiss (which re-render this provider) do
  // not re-render every useFeedback consumer.
  const value = useMemo(
    () => ({ showToast, confirm, alert }),
    [showToast, confirm, alert],
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {/* Toast layer — pointerEvents none so taps pass through to the app */}
      <View
        style={styles.toastLayer}
        pointerEvents="none"
        accessibilityLiveRegion="polite"
      >
        {toasts.map((toast) => (
          <ToastView key={toast.id} toast={toast} />
        ))}
      </View>

      {/* Confirm dialog — Modal works on iOS, Android, and react-native-web */}
      <Modal
        visible={confirmState !== null}
        transparent
        animationType="fade"
        onRequestClose={() => handleAnswer(false)}
      >
        {confirmState && (
          <ConfirmDialog state={confirmState} onAnswer={handleAnswer} />
        )}
      </Modal>
    </FeedbackContext.Provider>
  );
}

function ToastView({ toast }: { toast: ToastState }) {
  const { colors } = useAppTheme();
  const bg =
    toast.kind === 'error'
      ? colors.error
      : toast.kind === 'success'
        ? colors.success
        : colors.espresso;

  return (
    <View
      style={[styles.toast, { backgroundColor: bg }]}
      role={toast.kind === 'error' ? 'alert' : 'status'}
    >
      <Text style={styles.toastText}>{toast.message}</Text>
    </View>
  );
}

function ConfirmDialog({
  state,
  onAnswer,
}: {
  state: { opts: ConfirmOptions };
  onAnswer: (value: boolean) => void;
}) {
  const { colors } = useAppTheme();
  const { opts } = state;

  return (
    <View style={styles.modalBackdrop}>
      <TouchableOpacity
        style={styles.modalCardWrap}
        activeOpacity={1}
        onPress={() => {}}
        accessibilityLabel="Dialog"
      >
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.espresso }]}>
            {opts.title}
          </Text>
          <Text style={[styles.modalMessage, { color: colors.muted }]}>
            {opts.message}
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                { borderColor: colors.border, borderWidth: 1 },
              ]}
              onPress={() => onAnswer(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              hitSlop={6}
            >
              <Text style={[styles.modalBtnText, { color: colors.espresso }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                {
                  backgroundColor: opts.destructive
                    ? colors.error
                    : colors.terracotta,
                },
              ]}
              onPress={() => onAnswer(true)}
              accessibilityRole="button"
              accessibilityLabel={opts.confirmLabel ?? 'OK'}
              hitSlop={6}
            >
              <Text style={[styles.modalBtnText, styles.modalBtnPrimaryText]}>
                {opts.confirmLabel ?? 'OK'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toastLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Spacing.xl,
    alignItems: 'center',
    zIndex: 9999,
    gap: Spacing.sm,
  },
  toast: {
    maxWidth: 420,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalCardWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  modalCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  modalBtnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
