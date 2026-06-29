import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/theme';
import { useBreakpoint } from '../../src/hooks/useBreakpoint';
import {
  StarterFeeding,
} from '../../src/models/types';
import {
  loadFeedings,
  logFeeding,
  deleteFeeding,
  generateFeedingId,
  getLastFeeding,
  getFeedingInterval,
  setFeedingInterval,
} from '../../src/store/starterStore';
import { useNotifications } from '../../src/hooks/useNotifications';
import {
  scheduleFeedingReminder,
  cancelFeedingReminders,
} from '../../src/lib/notifications';
import { EmptyState } from '../../src/components/EmptyState';

const RATIOS = ['1:1:1', '1:2:2', '1:5:5'];
const DEFAULT_FLOUR = 'Generic: Bread Flour';

export default function StarterScreen() {
  const [feedings, setFeedings] = useState<StarterFeeding[]>([]);
  const [lastFed, setLastFed] = useState<StarterFeeding | null>(null);
  const [hoursSince, setHoursSince] = useState<string>('');
  const [intervalHours, setIntervalHours] = useState(24);
  const [selectedRatio, setSelectedRatio] = useState('1:1:1');
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const { hasPermission, request } = useNotifications();
  const { isDesktop } = useBreakpoint();

  // Load data on focus
  useFocusEffect(
    useCallback(() => {
      loadFeedings().then(setFeedings);
      getLastFeeding().then((lf) => {
        setLastFed(lf);
        if (lf) {
          const diff = Date.now() - new Date(lf.timestamp).getTime();
          setHoursSince((diff / 3600000).toFixed(1));
        }
      });
      getFeedingInterval().then(setIntervalHours);
    }, []),
  );

  // Update "hours since" every minute
  useEffect(() => {
    const t = setInterval(() => {
      if (lastFed) {
        const diff = Date.now() - new Date(lastFed.timestamp).getTime();
        setHoursSince((diff / 3600000).toFixed(1));
      }
    }, 60000);
    return () => clearInterval(t);
  }, [lastFed]);

  const handleFeedNow = async () => {
    const feeding: StarterFeeding = {
      id: generateFeedingId(),
      timestamp: new Date().toISOString(),
      flourUsed: DEFAULT_FLOUR,
      ratio: selectedRatio,
      notes: notes.trim() || undefined,
    };

    await logFeeding(feeding);
    setFeedings((prev) => [feeding, ...prev]);
    setLastFed(feeding);
    setHoursSince('0.0');
    setNotes('');

    // Update reminder if notifications enabled
    if (hasPermission) {
      await cancelFeedingReminders();
      if (intervalHours > 0) {
        await scheduleFeedingReminder(intervalHours);
      }
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Remove this feeding log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteFeeding(id);
          setFeedings((prev) => prev.filter((f) => f.id !== id));
          // Refresh last fed
          const lf = await getLastFeeding();
          setLastFed(lf);
          if (lf) {
            const diff = Date.now() - new Date(lf.timestamp).getTime();
            setHoursSince((diff / 3600000).toFixed(1));
          } else {
            setHoursSince('');
          }
        },
      },
    ]);
  };

  const handleSetInterval = async (hours: number) => {
    setIntervalHours(hours);
    await setFeedingInterval(hours);
    if (hasPermission && hours > 0) {
      await cancelFeedingReminders();
      await scheduleFeedingReminder(hours);
    }
  };

  const handleToggleNotifications = async () => {
    if (!hasPermission) {
      const granted = await request();
      if (granted && intervalHours > 0) {
        await scheduleFeedingReminder(intervalHours);
      }
    } else {
      await cancelFeedingReminders();
    }
  };

  // ── Shared panels ──────────────────────────────────────────────────

  const statusCard = (
    <View style={styles.statusCard}>
      {lastFed ? (
        <>
          <Text style={styles.statusLabel}>Last fed</Text>
          <Text style={styles.statusValue}>{hoursSince}h ago</Text>
          <Text style={styles.statusDate}>
            {new Date(lastFed.timestamp).toLocaleString()}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.statusLabel}>No feedings logged yet</Text>
          <Text style={styles.statusHint}>Feed your starter and log it below!</Text>
        </>
      )}
    </View>
  );

  const feedCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>FEED NOW</Text>

      <Text style={styles.sectionLabel}>Ratio</Text>
      <View style={styles.ratioRow}>
        {RATIOS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.ratioBtn, selectedRatio === r && styles.ratioBtnSelected]}
            onPress={() => setSelectedRatio(r)}
          >
            <Text
              style={[
                styles.ratioBtnText,
                selectedRatio === r && styles.ratioBtnTextSelected,
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.notesInput}
        placeholder="Notes (optional)"
        placeholderTextColor={Colors.muted}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.feedBtn} onPress={handleFeedNow} activeOpacity={0.8}>
        <Text style={styles.feedBtnText}>🍞 Feed Starter</Text>
      </TouchableOpacity>
    </View>
  );

  const scheduleCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>REMINDER SCHEDULE</Text>
      <View style={styles.ratioRow}>
        {[12, 24, 48].map((h) => (
          <TouchableOpacity
            key={h}
            style={[styles.ratioBtn, intervalHours === h && styles.ratioBtnSelected]}
            onPress={() => handleSetInterval(h)}
          >
            <Text
              style={[
                styles.ratioBtnText,
                intervalHours === h && styles.ratioBtnTextSelected,
              ]}
            >
              Every {h}h
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.notifBtn, hasPermission && styles.notifBtnActive]}
        onPress={handleToggleNotifications}
      >
        <Text style={styles.notifBtnText}>
          {hasPermission ? '🔔 Notifications ON' : '🔕 Notifications OFF — Tap to Enable'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const feedingHistory = (
    <>
      {feedings.length === 0 ? (
        <EmptyState
          icon="🕰️"
          title="No feeding history"
          subtitle="Log your first feeding to start tracking."
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.historyToggle}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.historyToggleText}>
              {showDetails ? 'Hide' : 'Show'} feeding history ({feedings.length})
            </Text>
          </TouchableOpacity>

          {showDetails && (
            <FlatList
              data={feedings.slice(0, 30)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyDate}>
                      {new Date(item.timestamp).toLocaleString()}
                    </Text>
                    <Text style={styles.historyMeta}>
                      {item.ratio} ratio · {item.flourUsed}
                      {item.notes ? ` · ${item.notes}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </>
      )}
    </>
  );

  // ── Desktop Layout ───────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.header}>🫙  Starter Tracker</Text>
        <View style={desktopStyles.twoCol}>
          <ScrollView
            style={desktopStyles.leftCol}
            contentContainerStyle={desktopStyles.colContent}
            showsVerticalScrollIndicator={false}
          >
            {statusCard}
            {feedCard}
          </ScrollView>
          <ScrollView
            style={desktopStyles.rightCol}
            contentContainerStyle={desktopStyles.colContent}
            showsVerticalScrollIndicator={false}
          >
            {scheduleCard}
            {feedingHistory}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // ── Mobile Layout ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>🫙  Starter Tracker</Text>
        {statusCard}
        {feedCard}
        {scheduleCard}
        {feedingHistory}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.espresso,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  statusCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: FontSize.sm,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.terracotta,
    marginTop: Spacing.xs,
  },
  statusDate: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: Spacing.xs,
  },
  statusHint: {
    fontSize: FontSize.md,
    color: Colors.muted,
    marginTop: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    color: Colors.espresso,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  ratioRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  ratioBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F0EBE5',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratioBtnSelected: {
    backgroundColor: Colors.terracotta,
    borderColor: Colors.terracotta,
  },
  ratioBtnText: {
    fontSize: FontSize.sm,
    color: Colors.espresso,
    fontWeight: '500',
  },
  ratioBtnTextSelected: {
    color: Colors.white,
  },
  notesInput: {
    height: 36,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.espresso,
    marginBottom: Spacing.md,
  },
  feedBtn: {
    backgroundColor: Colors.olive,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  feedBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  notifBtn: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F0EBE5',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  notifBtnActive: {
    borderColor: Colors.olive,
    backgroundColor: '#F0F5EB',
  },
  notifBtnText: {
    fontSize: FontSize.sm,
    color: Colors.espresso,
    fontWeight: '500',
  },
  historyToggle: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  historyToggleText: {
    fontSize: FontSize.sm,
    color: Colors.terracotta,
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xs + 2,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  historyDate: {
    fontSize: FontSize.sm,
    color: Colors.espresso,
    fontWeight: '500',
  },
  historyMeta: {
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  deleteIcon: {
    fontSize: FontSize.md,
    padding: Spacing.sm,
  },
});

const desktopStyles = StyleSheet.create({
  twoCol: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    flex: 1,
  },
  colContent: {
    paddingBottom: 40,
  },
});
