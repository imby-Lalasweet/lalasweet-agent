import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: 'lalasweet-auth-token',
      persistSession: true,
    },
  })
  : null;

// ====== Auth / Users ======

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Google OAuth Login
export const signInWithGoogle = async () => {
  if (!supabase) return { error: 'DB 미연결' };
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  return { data, error };
};

export const syncGoogleUser = async (authUser) => {
  if (!supabase || !authUser) return null;
  // Get name from Google profile or fallback to email part
  const fullName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'GoogleUser';

  // Custom dummy password for Google users internally
  const pwPlain = `google_${authUser.id.split('-')[0]}`;
  const pwHash = await hashPassword(pwPlain);

  // Check if user exists by username (to link accounts)
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('username', fullName)
    .maybeSingle();

  if (existing) {
    // Update last_login and email if missing
    await supabase.from('users').update({
      last_login: new Date().toISOString(),
      email: authUser.email || existing.email
    }).eq('id', existing.id);
    return existing;
  }

  // Create new user linked to Google name
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      username: fullName,
      password_hash: pwHash,
      password_plain: pwPlain,
      email: authUser.email || null
    })
    .select()
    .single();

  if (error) {
    console.error("Error syncing Google user to users table:", error.message);
    return null;
  }
  return newUser;
};

/**
 * Login: returns { success, user, error }
 * - username exists + password matches → login
 * - username exists + password wrong → error "비밀번호가 틀렸습니다"
 * - username not found → auto-register then login
 */
export const loginUser = async (username, password) => {
  if (!supabase) return { success: false, error: 'DB 미연결' };
  const pw = await hashPassword(password);

  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (existing) {
    // User found – check password
    if (existing.password_hash === pw) {
      // Update last_login
      await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', existing.id);
      return { success: true, user: existing, isNew: false };
    } else {
      return { success: false, error: '비밀번호가 틀렸습니다' };
    }
  }

  // User not found – auto register
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({ username, password_hash: pw, password_plain: password })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, user: newUser, isNew: true };
};

export const getAllUsers = async () => {
  if (!supabase) return [];
  const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const deleteUser = async (id) => {
  if (!supabase) return;
  // Delete user's data first
  await supabase.from('agent_logs').delete().eq('user_id', id);
  await supabase.from('org_goals').delete().eq('user_id', id);
  // rooms cascade-deletes histories
  await supabase.from('rooms').delete().eq('user_id', id);
  await supabase.from('users').delete().eq('id', id);
};

export const resetUserPassword = async (id) => {
  if (!supabase) return false;
  const pw = await hashPassword('1234');
  const { error } = await supabase.from('users')
    .update({ password_hash: pw, password_plain: '1234' })
    .eq('id', id);
  return !error;
};

export const changeUserPassword = async (id, newPassword) => {
  if (!supabase) return false;
  const pw = await hashPassword(newPassword);
  const { error } = await supabase.from('users')
    .update({ password_hash: pw, password_plain: newPassword })
    .eq('id', id);
  return !error;
};

// ====== Level Guides (global, not per-user) ======

export const getLevelGuide = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('level_guides').select('*').order('created_at', { ascending: false }).limit(1);
  if (error || !data.length) return null;
  return data[0];
};

export const saveLevelGuide = async (name, data) => {
  if (!supabase) throw new Error('Supabase not configured');
  await supabase.from('level_guides').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error } = await supabase.from('level_guides').insert({ name, data });
  if (error) throw new Error(error.message);
  return true;
};

export const deleteLevelGuide = async () => {
  if (!supabase) return;
  await supabase.from('level_guides').delete().neq('id', '00000000-0000-0000-0000-000000000000');
};

// ====== Working Style (global, not per-user) ======

export const getWorkingStyle = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('working_style').select('*').order('updated_at', { ascending: false }).limit(1);
  if (error || !data.length) return null;
  return data[0];
};

export const saveWorkingStyle = async (content) => {
  if (!supabase) throw new Error('Supabase not configured');
  await supabase.from('working_style').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error } = await supabase.from('working_style').insert({ content, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  return true;
};

export const deleteWorkingStyle = async () => {
  if (!supabase) return;
  await supabase.from('working_style').delete().neq('id', '00000000-0000-0000-0000-000000000000');
};

// ====== Rooms & Histories (per-user) ======

export const getRooms = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from('rooms')
    .select(`*, histories (*)`)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) return [];
  return data.map(room => ({
    ...room,
    history: (room.histories || []).sort((a, b) => b.ts - a.ts)
  }));
};

export const saveRoom = async (room, userId) => {
  if (!supabase) return null;
  const { history, histories, ...roomData } = room;
  const { data, error } = await supabase.from('rooms').upsert({ ...roomData, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const deleteRoom = async (id) => {
  if (!supabase) return;
  await supabase.from('rooms').delete().eq('id', id);
};

export const addRoomHistory = async (roomId, entry) => {
  if (!supabase) return;
  const { error } = await supabase.from('histories').insert({
    room_id: roomId,
    mode: entry.mode,
    mode_label: entry.modeLabel,
    result: entry.result,
    info: entry.info || {},
    ts: entry.ts || Date.now()
  });
  if (error) throw error;
  return entry;
};

// ====== Organization Goals (per-user) ======

export const getOrgGoals = async (team, userId) => {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('org_goals')
    .select('*')
    .eq('team', team)
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return { goals: data.goals, updatedAt: data.updated_at };
};

export const saveOrgGoals = async (team, goals, userId) => {
  if (!supabase || !userId) return;
  await supabase.from('org_goals').upsert({ team, goals, user_id: userId, updated_at: new Date().toISOString() });
};

// ====== Agent Logs (per-user) ======

export const getAgentLogs = async (userId) => {
  if (!supabase) return [];
  let query = supabase.from('agent_logs').select('*').order('ts', { ascending: false }).limit(100);
  // Admin: no userId → all logs; User: filtered
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) return [];
  return data;
};

export const saveAgentLog = async (logData, userId, username) => {
  if (!supabase) return;
  await supabase.from('agent_logs').insert({ ...logData, user_id: userId, username: username || null });
};

export const clearAgentLogs = async () => {
  if (!supabase) return;
  await supabase.from('agent_logs').delete().neq('ts', 0);
};
