import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
}

/**
 * Small wrapper around Ionicons so the rest of the app doesn't need to know
 * which icon library is used. Ionicons is MIT-licensed and bundled with
 * @expo/vector-icons.
 */
export function Icon({ name, size = 20, color }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
