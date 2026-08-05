/**
 * Responsive calculator shell shared by the three calculator screens
 * (bread, yogurt, lacto-fermentation).
 *
 * Desktop: header (optional) above a two-column layout — left scroll of
 * inputs, right scroll of results. Mobile: a single scroll with header,
 * inputs, then results. This was previously copy-pasted ~80 lines per
 * screen with slightly different bottom padding and ref wiring.
 */
import React, { RefObject } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MaxWidth, Spacing } from '../theme';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { KeyboardScreen } from './KeyboardScreen';

interface Props {
  children: React.ReactNode;
  /** Results column content (desktop right / mobile below inputs). */
  right: React.ReactNode;
  /** Optional header — above the two columns on desktop, inside the scroll on mobile. */
  header?: React.ReactNode;
  /** Attached to the left/mobile scroll (used for scroll-to-top/end). */
  leftRef?: RefObject<ScrollView | null>;
  /** Attached to the desktop right scroll. */
  rightRef?: RefObject<ScrollView | null>;
  /** Bottom clearance on mobile. */
  bottomPad?: number;
}

export function CalculatorShell({
  children,
  right,
  header,
  leftRef,
  rightRef,
  bottomPad = 60,
}: Props) {
  const { isDesktop } = useBreakpoint();

  return (
    <KeyboardScreen>
      {isDesktop && header}
      {isDesktop ? (
        <View style={shellStyles.twoCol}>
          <ScrollView
            ref={leftRef}
            style={shellStyles.leftCol}
            contentContainerStyle={shellStyles.leftContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
          <ScrollView
            ref={rightRef}
            style={shellStyles.rightCol}
            contentContainerStyle={shellStyles.rightContent}
            showsVerticalScrollIndicator={false}
          >
            {right}
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          ref={leftRef}
          style={shellStyles.mobileScroll}
          contentContainerStyle={shellStyles.mobileContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {header}
          {children}
          {right}
          <View style={{ height: bottomPad }} />
        </ScrollView>
      )}
    </KeyboardScreen>
  );
}

const shellStyles = StyleSheet.create({
  twoCol: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  leftCol: { flex: 1, maxWidth: 420 },
  leftContent: { paddingBottom: 40, paddingTop: Spacing.md },
  rightCol: { flex: 1.3 },
  rightContent: { paddingBottom: 40, paddingTop: Spacing.md },
  mobileScroll: { flex: 1 },
  mobileContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    maxWidth: MaxWidth.form,
    width: '100%',
    alignSelf: 'center',
  },
});
