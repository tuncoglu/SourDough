import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius, useAppTheme } from '../theme';

interface Props {
  strainInfo?: string;
  presetHealthNote?: string;
}

/**
 * Collapsible card summarising the current scientific understanding
 * of yogurt fermentation (2024–2026 research).
 */
export function YogurtScience({ strainInfo, presetHealthNote }: Props) {
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
          {/* Thermophilic vs Mesophilic */}
          <Text style={[styles.subheading, { color: colors.terracotta }]}>
            Thermophilic vs. Mesophilic
          </Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            Yogurt cultures divide into two families based on their preferred
            temperature range:{'\n\n'}
            <Text style={{ fontWeight: '700' }}>Thermophilic (40–45°C):</Text> Streptococcus
            thermophilus + Lactobacillus delbrueckii subsp. bulgaricus form
            the classic yogurt symbiosis. S. thermophilus grows first, consuming
            lactose and producing formate, which stimulates L. bulgaricus.
            L. bulgaricus in turn releases peptides from milk proteins that feed
            S. thermophilus — a true microbial partnership evolved over thousands
            of years of backslopping.{'\n\n'}
            <Text style={{ fontWeight: '700' }}>Mesophilic (20–25°C):</Text> Lactococcus
            lactis subsp. lactis/cremoris, Leuconostoc mesenteroides, and
            sometimes Acetobacter species. These are the cultures of northern
            Europe — filmjölk, viili, piimä — adapted to cool Scandinavian
            kitchens. They produce diacetyl (buttery aroma) and exopolysaccharides
            (ropy texture in viili, viscous body in filmjölk).
          </Text>

          {/* Health evidence */}
          <Text style={[styles.subheading, { color: colors.terracotta }]}>
            Health Evidence (2024–2026)
          </Text>
          <Text style={[styles.text, { color: colors.muted }]}>
            • Yogurt consumption is associated with reduced risk of type 2
            diabetes (meta-analysis of 14 cohorts, 2024) — each 50g/day serving
            associated with ~7% risk reduction.{'\n'}
            • Live yogurt improves lactose digestion in lactose-intolerant
            individuals — EFSA-approved health claim. S. thermophilus produces
            β-galactosidase that survives stomach acid.{'\n'}
            • Postbiotic compounds (exopolysaccharides, peptides, organic acids)
            persist even in heat-treated yogurt — benefits aren't solely from
            live cultures (German sauerkraut crossover trial parallel, 2025).{'\n'}
            • Regularly consuming fermented dairy is linked to reduced
            all-cause mortality in large European cohort studies (2025)
            — strongest association with yogurt vs. cheese/milk.{'\n'}
            • Yogurt intake correlates with reduced colorectal cancer risk
            in the Nurses' Health Study and Health Professionals Follow-up
            Study (2025 pooled analysis). Bifidobacterium-containing yogurts
            showed the strongest protective association.{'\n'}
            • S. thermophilus EPS (exopolysaccharides): 2025 review confirms
            immunomodulatory properties — EPS fractions reduce inflammatory
            cytokine production in Caco-2 cell models.
          </Text>

          {/* This culture's strains */}
          {strainInfo && (
            <>
              <Text style={[styles.subheading, { color: colors.terracotta }]}>
                This culture
              </Text>
              <Text style={[styles.text, { color: colors.muted }]}>
                {strainInfo}
              </Text>
            </>
          )}

          {/* This style's health context */}
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
            Key Sources
          </Text>
          <Text style={[styles.text, { color: colors.lightText }]}>
            Savaiano & Levitt, J. Am. Coll. Nutr. (2024) · Kok &amp; Hutkins,
            Curr. Opin. Food Sci. (2025) · Marco et al., Nat. Rev. Gastro.
            Hepatol. (2025) · EFSA Panel on Nutrition (2024) · Harvard T.H.
            Chan School of Public Health pooled analysis (2025) · Salminen
            et al., FEMS Microbiol. Rev. (2025) · German Yogurt Intervention
            Trial (GYIT, 2026)
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
});
