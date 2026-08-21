import React from 'react';
import { Ionicon } from './Ionicon';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicon>['name'];

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
  return <Ionicon name={name} size={size} color={color} />;
}
