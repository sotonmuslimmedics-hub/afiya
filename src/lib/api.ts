import { supabase } from './supabase';
import type { CategoryId } from './categories';
import type { InboxItem, Thread } from './types';

/** Student: submit a new concern. Returns the anonymous code (shown once). */
export async function submitConcern(category: CategoryId, message: string): Promise<string> {
  const { data, error } = await supabase.rpc('submit_concern', {
    p_category: category,
    p_message: message,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

/** Student: look up a thread by its code. Returns null if the code doesn't match anything. */
export async function getThreadByCode(code: string): Promise<Thread | null> {
  const { data, error } = await supabase.rpc('get_thread_by_code', { p_code: code });
  if (error) throw new Error(error.message);
  return (data as Thread | null) ?? null;
}

/** Student: send a follow-up message on their own thread. */
export async function addStudentReply(code: string, message: string): Promise<void> {
  const { error } = await supabase.rpc('add_student_reply', { p_code: code, p_message: message });
  if (error) throw new Error(error.message);
}

/** Welfare Team: list all concerns (most recent activity first). */
export async function listConcerns(): Promise<InboxItem[]> {
  const { data, error } = await supabase
    .from('concerns')
    .select('id, code, category, message, status, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as InboxItem[];
}

/** Welfare Team: fetch one concern plus its replies. */
export async function getConcern(id: string): Promise<{ concern: InboxItem; replies: Thread['replies'] }> {
  const [{ data: concern, error: concernError }, { data: replies, error: repliesError }] = await Promise.all([
    supabase.from('concerns').select('id, code, category, message, status, created_at, updated_at').eq('id', id).single(),
    supabase.from('replies').select('sender, message, created_at').eq('concern_id', id).order('created_at', { ascending: true }),
  ]);
  if (concernError) throw new Error(concernError.message);
  if (repliesError) throw new Error(repliesError.message);
  return { concern: concern as InboxItem, replies: (replies ?? []) as Thread['replies'] };
}

/** Welfare Team: reply privately to a concern. */
export async function welfareSendReply(concernId: string, message: string): Promise<void> {
  const { error } = await supabase.rpc('welfare_send_reply', { p_concern_id: concernId, p_message: message });
  if (error) throw new Error(error.message);
}

/** Welfare Team: mark a concern resolved or reopen it (back to answered). */
export async function setConcernStatus(concernId: string, status: 'answered' | 'resolved'): Promise<void> {
  const { error } = await supabase.rpc('set_concern_status', { p_id: concernId, p_status: status });
  if (error) throw new Error(error.message);
}
