import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

interface Props {
  children: React.ReactNode;
}

/** Shared KeyboardAvoidingView wrapper for form screens. */
export function KeyboardScreen({ children }: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
