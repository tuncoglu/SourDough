import React from 'react';
import { NoticeCard } from './NoticeCard';

interface Props {
  warnings: string[];
}

/** Warning cards — a NoticeCard with the warning tone. */
export function AdviceCards({ warnings }: Props) {
  return <NoticeCard title="⚠️  Warnings" lines={warnings} tone="warning" />;
}
