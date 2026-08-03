import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';

interface Props {
  /** Research note from the selected vegetable, if any. */
  vegResearchNote?: string;
  /** Health note from the selected preset, if any. */
  presetHealthNote?: string;
}

/**
 * Collapsible card summarising the current scientific understanding
 * of lacto-fermentation (2024–2026 research).
 */
export function LactoScience({ vegResearchNote, presetHealthNote }: Props) {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, { color: colors.espresso }]}>🔬 The Science</Text>
        <Text style={[styles.chevron, { color: colors.muted }]}>
          {expanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          {/* LAB succession */}
          <Text style={[styles.subheading, { color: colors.terracotta }]}>
            Microbial succession
          </Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            Vegetable fermentations follow a predictable 3-phase pattern confirmed
            across multiple 2024–2026 studies:
          </Text>
          <View style={styles.phases}>
            <View style={styles.phase}>
              <Text style={[styles.phaseNum, { color: colors.terracotta }]}>1</Text>
              <View style={styles.phaseContent}>
                <Text style={[styles.phaseTitle, { color: colors.espresso }]}>
                  Enterobacteriaceae{'\n'}
                  <Text style={[styles.phaseTime, { color: colors.lightText }]}>
                    Hours 0–24
                  </Text>
                </Text>
                <Text style={[styles.phaseDesc, { color: colors.muted }]}>
                  Plant-surface bacteria fade as salt & anaerobiosis take hold.
                </Text>
              </View>
            </View>
            <View style={[styles.connector, { backgroundColor: colors.border }]} />
            <View style={styles.phase}>
              <Text style={[styles.phaseNum, { color: colors.olive }]}>2</Text>
              <View style={styles.phaseContent}>
                <Text style={[styles.phaseTitle, { color: colors.espresso }]}>
                  Leuconostoc mesenteroides{'\n'}
                  <Text style={[styles.phaseTime, { color: colors.lightText }]}>
                    Days 1–4
                  </Text>
                </Text>
                <Text style={[styles.phaseDesc, { color: colors.muted }]}>
                  CO₂ bubbles appear. Initiates acidification and creates conditions
                  for later-stage LAB. Weissella species also active.
                </Text>
              </View>
            </View>
            <View style={[styles.connector, { backgroundColor: colors.border }]} />
            <View style={styles.phase}>
              <Text style={[styles.phaseNum, { color: colors.cool }]}>3</Text>
              <View style={styles.phaseContent}>
                <Text style={[styles.phaseTitle, { color: colors.espresso }]}>
                  Lactiplantibacillus plantarum{'\n'}
                  <Text style={[styles.phaseTime, { color: colors.lightText }]}>
                    Day 4+
                  </Text>
                </Text>
                <Text style={[styles.phaseDesc, { color: colors.muted }]}>
                  Acid-tolerant workhorse dominates. Pediococcus may appear.
                  Produces bioactive compounds: GABA, indole-3-lactic acid,
                  phenyl-lactic acid.
                </Text>
              </View>
            </View>
          </View>

          {/* Health evidence */}
          <Text style={[styles.subheading, { color: colors.terracotta }]}>
            Health evidence (2024–2026)
          </Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            • Kimchi: 11 clinical trials — reduced body weight, IBS symptoms,
            LDL cholesterol & fasting glucose. UC Davis trial ongoing
            (NCT07435831, 2026).{'\n'}
            • Fermented carrots, kohlrabi & kimchi (2025 trial): ↑
            butyrate-producing gut bacteria, improved cellular health
            biomarkers.{'\n'}
            • German sauerkraut crossover trial (2025): both live and
            pasteurised sauerkraut shifted the gut microbiome — postbiotics
            (bacterial metabolites) may matter as much as live cultures.{'\n'}
            • USDA pilot study (2026): establishing safety benchmarks for
            fermented vegetables as dietary interventions (target: &gt;10⁷
            CFU/g LAB, pH ≤3.5).
          </Text>

          {/* Vegetable-specific research */}
          {vegResearchNote && (
            <>
              <Text style={[styles.subheading, { color: colors.terracotta }]}>
                This vegetable
              </Text>
              <Text style={[styles.text, { color: colors.muted }]}>
                {vegResearchNote}
              </Text>
            </>
          )}

          {/* Preset-specific health context */}
          {presetHealthNote && (
            <>
              <Text style={[styles.subheading, { color: colors.terracotta }]}>
                This ferment style
              </Text>
              <Text style={[styles.text, { color: colors.muted }]}>
                {presetHealthNote}
              </Text>
            </>
          )}

          {/* Key papers */}
          <Text style={[styles.subheading, { color: colors.terracotta }]}>
            Key sources
          </Text>
          <Text style={[styles.text, { color: colors.lightText }]}>
            Wierzbicka & Janiszewska-Turak, Appl. Sci. (2024) · Valence et
            al., Peer Community J. (2025) · Zeng et al., China Brewing
            (2025) · Pihelgas et al., Front. Nutr. (2025) · Wei et al., Annu.
            Rev. Food Sci. Technol. (2025) · Chen et al., Food Res. Int.
            (2026) · Couderc et al., Food Microbiol. (2026) · Andreson et
            al., Fermentation (2024)
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  chevron: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  subheading: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  text: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  phases: {
    gap: 0,
  },
  phase: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  phaseNum: {
    fontSize: FontSize.md,
    fontWeight: '800',
    width: 22,
    height: 22,
    lineHeight: 22,
    textAlign: 'center',
    borderRadius: 11,
    overflow: 'hidden',
    marginTop: 2,
  },
  phaseContent: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  phaseTime: {
    fontSize: FontSize.xs,
    fontWeight: '400',
  },
  phaseDesc: {
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginTop: 2,
  },
  connector: {
    width: 1.5,
    height: 12,
    marginLeft: 32,
  },
});
