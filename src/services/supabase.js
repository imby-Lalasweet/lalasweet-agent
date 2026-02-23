import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/** Level Guides */
export const getLevelGuide = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('level_guides').select('*').order('created_at', { ascending: false }).limit(1);
  if (error || !data.length) return null;
  return data[0];
};

export const saveLevelGuide = async (name, data) => {
  if (!supabase) throw new Error('Supabase not configured');
  // Delete old to keep only latest (or simply insert new and rely on getLevelGuide order)
  await supabase.from('level_guides').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // clear all
  const { error } = await supabase.from('level_guides').insert({ name, data });
  if (error) throw new Error(error.message);
  return true;
};

export const deleteLevelGuide = async () => {
  if (!supabase) return;
  await supabase.from('level_guides').delete().neq('id', '00000000-0000-0000-0000-000000000000');
};

/** Rooms & Histories */
export const getRooms = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      histories (*)
    `)
    .order('updated_at', { ascending: false });
  if (error) return [];
  
  return data.map(room => ({
    ...room,
    history: room.histories.sort((a, b) => b.ts - a.ts)
  }));
};

export const saveRoom = async (room) => {
  if (!supabase) return null;
  const { history, histories, ...roomData } = room;
  const { error } = await supabase.from('rooms').upsert(roomData);
  if (error) throw error;
  return room;
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

/** Organization Goals */
export const getOrgGoals = async (team) => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('org_goals').select('*').eq('team', team).single();
  if (error) return null;
  return { goals: data.goals, updatedAt: data.updated_at };
};

export const saveOrgGoals = async (team, goals) => {
  if (!supabase) return;
  await supabase.from('org_goals').upsert({ team, goals, updated_at: new Date().toISOString() });
};

/** Agent Logs */
export const getAgentLogs = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('agent_logs').select('*').order('ts', { ascending: false }).limit(100);
  if (error) return [];
  return data;
};

export const saveAgentLog = async (logData) => {
  if (!supabase) return;
  await supabase.from('agent_logs').insert(logData);
};

export const clearAgentLogs = async () => {
  if (!supabase) return;
  await supabase.from('agent_logs').delete().neq('ts', 0);
};
