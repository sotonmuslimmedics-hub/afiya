export type CategoryId =
  | 'academic'
  | 'financial'
  | 'wellbeing'
  | 'faith'
  | 'conduct'
  | 'placement'
  | 'other';

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'academic', label: 'Academic & workload' },
  { id: 'financial', label: 'Financial' },
  { id: 'wellbeing', label: 'Mental health & wellbeing' },
  { id: 'faith', label: 'Faith & belonging' },
  { id: 'conduct', label: 'Harassment or discrimination' },
  { id: 'placement', label: 'Clinical placement' },
  { id: 'other', label: 'Something else' },
];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'Something else';
}
