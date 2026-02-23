-- Create level_guides table
CREATE TABLE level_guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  team TEXT NOT NULL,
  name TEXT NOT NULL,
  level TEXT,
  role TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Create histories table (one-to-many with rooms)
CREATE TABLE histories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
  mode INTEGER NOT NULL,
  mode_label TEXT NOT NULL,
  result TEXT NOT NULL,
  info JSONB,
  ts BIGINT NOT NULL
);

-- Create org_goals table
CREATE TABLE org_goals (
  team TEXT PRIMARY KEY,
  goals TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agent_logs table
CREATE TABLE agent_logs (
  ts BIGINT PRIMARY KEY,
  mode INTEGER,
  mode_label TEXT,
  name TEXT,
  team TEXT,
  role TEXT,
  level TEXT,
  result TEXT,
  date TIMESTAMPTZ NOT NULL
);
