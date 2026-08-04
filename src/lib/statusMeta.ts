import type { ConcernStatus } from './types';

export const STATUS_META: Record<ConcernStatus, { label: string; className: string }> = {
  needs_reply: { label: 'Needs reply', className: 'tag tag-accent' },
  answered: { label: 'Answered', className: 'tag tag-answered' },
  resolved: { label: 'Resolved', className: 'tag tag-resolved' },
};
