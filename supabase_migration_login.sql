-- ============================================
-- Login System Migration
-- Supabase SQL Editor에서 이 스크립트를 실행해주세요
-- ============================================

-- 1. users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_plain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

-- 1-1. 기존 users 테이블에 password_plain 컬럼이 없는 경우 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_plain TEXT;

-- 2. 기존 테이블에 user_id 컬럼 추가
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
ALTER TABLE org_goals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
ALTER TABLE agent_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- 2-1. agent_logs에 username 컬럼 추가
ALTER TABLE agent_logs ADD COLUMN IF NOT EXISTS username TEXT;

-- 3. org_goals 기존 Primary Key 변경 (team → team + user_id 복합)
-- 기존 PK 제거 후 새로운 복합 유니크 제약 추가
ALTER TABLE org_goals DROP CONSTRAINT IF EXISTS org_goals_pkey;
ALTER TABLE org_goals ADD PRIMARY KEY (team, user_id);
