import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';
import { formatTemp } from '../lib/unitConversion';
import { RecipePreset } from '../models/types';
import { PROOF_FRACTION } from '../lib/calculations';

interface Props {
  preset: RecipePreset;
  staticFermentHours: number;
  fermentAdvice?: string[];
}

interface Step {
  number: number;
  title: string;
  description: string;
  time: string;
}

function buildSteps(preset: RecipePreset, fermentHours: number, unitSystem: import('../models/types').UnitSystem): Step[] {
  const steps: Step[] = [];
  const { process, bake, dough } = preset;
  let n = 0;

  // Step 1: Autolyse
  if (process.autolyseMinutes > 0) {
    n++;
    steps.push({
      number: n,
      title: 'Autolyse',
      description: `Mix the flour${dough.preferment ? ' and pre-ferment' : ''} with the water (reserve ~5% to add with salt). Rest covered at room temperature.`,
      time: `${process.autolyseMinutes} min`,
    });
  }

  // Step 2: Add starter + salt (+ oil)
  n++;
  const additions: string[] = ['starter', 'salt'];
  if ((dough.oilPct ?? 0) > 0) additions.push('oil/fat');
  if ((dough.oilPct ?? 0) > 0) {
    steps.push({
      number: n,
      title: 'Incorporate starter, salt & oil',
      description: `Add the starter, salt, and oil${dough.oilPct ? ` (${dough.oilPct}%)` : ''} to the autolysed dough. Mix thoroughly${dough.oilPct! >= 10 ? ' — the oil takes time to absorb into the dough.' : '.'}`,
      time: '5–10 min',
    });
  } else {
    steps.push({
      number: n,
      title: 'Incorporate starter & salt',
      description: 'Add the starter and salt to the autolysed dough. Squeeze and fold until fully incorporated and the dough feels uniform.',
      time: '5–10 min',
    });
  }

  // Step 3: Stretch and folds
  if (process.folds > 0) {
    n++;
    const totalFoldTime = process.folds * process.foldIntervalMinutes;
    const foldSteps = Array.from({ length: process.folds }, (_, i) =>
      `Fold ${i + 1}: at ${i * process.foldIntervalMinutes} min`
    ).join(' · ');
    steps.push({
      number: n,
      title: 'Stretch & folds',
      description: `Perform ${process.folds} stretch${process.folds > 1 ? 'es' : ''}-and-fold${process.folds > 1 ? 's' : ''}, one every ${process.foldIntervalMinutes} minutes, during the first ~${totalFoldTime} min of bulk fermentation.${process.folds > 3 ? ' Be gentle — the dough gets tighter with each fold.' : ''}`,
      time: `${foldSteps}`,
    });
  }

  // Step 4: Bulk fermentation
  n++;
  steps.push({
    number: n,
    title: 'Bulk fermentation',
    description: `Let the dough ferment at room temperature until roughly doubled. Look for a domed surface, visible bubbles, and a slight jiggle when you shake the bowl. The dough should feel airy and alive.`,
    time: `~${fermentHours.toFixed(1)} hours`,
  });

  // Step 5: Pre-shape
  if (process.benchRestMinutes > 0) {
    n++;
    const method = process.shapingMethod || '';
    const isBoule = method.includes('boule');
    steps.push({
      number: n,
      title: 'Pre-shape',
      description: `Turn the dough out onto a lightly floured surface. Pre-shape into a ${isBoule ? 'loose round' : 'rough form'}. Let it rest uncovered on the bench — this relaxes the gluten for final shaping.`,
      time: `${process.benchRestMinutes} min`,
    });
  }

  // Step 6: Final shape
  if (process.shapingMethod) {
    n++;
    const vessel = process.proofingVessel || 'banneton';
    steps.push({
      number: n,
      title: 'Final shape',
      description: `Shape the dough: ${process.shapingMethod}. Place seam-side-up in a well-floured ${vessel}.`,
      time: '5 min',
    });
  }

  // Step 7: Proof
  n++;
  const proofEstimate = Math.round(fermentHours * PROOF_FRACTION * 2) / 2;
  steps.push({
    number: n,
    title: 'Proof',
    description: `Proof until the dough passes the finger-dent test — press gently with a floured finger; it should spring back slowly and leave a slight indentation.${preset.id === '100-rye' ? ' Rye dough does not spring back like wheat — look for small cracks on the surface instead.' : ''}`,
    time: `~${proofEstimate.toFixed(1)} hours${fermentHours > 10 ? ' (or cold-proof overnight)' : ''}`,
  });

  // Step 8: Score
  if (process.scoringPattern && process.scoringPattern !== 'none' && process.scoringPattern !== 'none (dimpled)') {
    n++;
    steps.push({
      number: n,
      title: 'Score',
      description: `Just before baking, score the dough with a sharp lame or razor blade: ${process.scoringPattern}.${process.scoringPattern.includes('diagonal') ? ' Hold the blade at ~30° to the surface for the classic "ear".' : ''}`,
      time: '<1 min',
    });
  } else if (process.scoringPattern === 'none (dimpled)') {
    n++;
    steps.push({
      number: n,
      title: 'Dimple',
      description: 'Dimple the dough all over with wet fingertips. Drizzle with extra olive oil and scatter flaky salt, rosemary, or toppings of your choice.',
      time: '2 min',
    });
  }

  // Step 9: Bake
  n++;
  const steamNote = bake.steamRequired
    ? ' Add steam for the first 10–15 min (ice cubes in a tray underneath, or spray the oven walls).'
    : '';
  steps.push({
    number: n,
    title: 'Bake',
    description: `Pre-heat oven to ${formatTemp(bake.ovenTempC, unitSystem)}${bake.bakingVessel && bake.bakingVessel !== 'baking tray' ? ` with ${bake.bakingVessel} inside` : ''}.${steamNote}${bake.notes ? ` ${bake.notes}` : ''}`,
    time: `${bake.bakeTimeMinutes} min`,
  });

  return steps;
}

export function MethodTimeline({ preset, staticFermentHours, fermentAdvice }: Props) {
  const { unitSystem, colors } = useAppTheme();
  if (preset.id === 'custom') return null;

  const steps = buildSteps(preset, staticFermentHours, unitSystem);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.muted }]}>📝  Method</Text>
      <Text style={[styles.subtitle, { color: colors.espresso }]}>
        {preset.emoji} {preset.name} · {preset.difficulty}
      </Text>

      {steps.map((step, i) => (
        <View key={i} style={styles.stepRow}>
          <View style={[styles.circle, { backgroundColor: colors.olive }]}>
            <Text style={[styles.circleText, { color: colors.white }]}>{step.number}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.espresso }]}>{step.title}</Text>
            <Text style={[styles.stepDesc, { color: colors.espresso }]}>{step.description}</Text>
            <View style={[styles.timeBadge, { backgroundColor: colors.tipBg }]}>
              <Text style={[styles.timeBadgeText, { color: colors.terracotta }]}>⏱ {step.time}</Text>
            </View>
            {step.title === 'Bulk fermentation' && fermentAdvice && fermentAdvice.length > 0 && (
              <View style={[styles.fermentAdviceBox, { backgroundColor: colors.tipBg, borderLeftColor: colors.olive }]}>
                {fermentAdvice.map((line, j) => (
                  <Text key={j} style={[styles.fermentAdviceLine, { color: colors.espresso }]}>{line}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      ))}

      {preset.tips && preset.tips.length > 0 && (
        <View style={[styles.tipsSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.tipsTitle, { color: colors.muted }]}>💡 Tips</Text>
          {preset.tips.map((tip, i) => (
            <Text key={i} style={[styles.tipText, { color: colors.espresso }]}>
              {tip}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  circleText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: FontSize.sm,
    lineHeight: 19,
    marginBottom: 2,
  },
  stepTime: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  timeBadge: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs + 1,
  },
  timeBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  tipsSection: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tipsTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  tipText: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginBottom: 2,
  },
  fermentAdviceBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderRadius: BorderRadius.sm,
  },
  fermentAdviceLine: {
    fontSize: FontSize.xs,
    lineHeight: 18,
    marginBottom: 1,
  },
});
