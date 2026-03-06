-- ============================================================
-- RLS 정책: authenticated 역할에도 모든 테이블 접근 허용
-- 기존 정책이 있으면 삭제 후 재생성
-- ============================================================

-- 1. users
DROP POLICY IF EXISTS "authenticated_select_users" ON public.users;
DROP POLICY IF EXISTS "authenticated_insert_users" ON public.users;
DROP POLICY IF EXISTS "authenticated_update_users" ON public.users;
DROP POLICY IF EXISTS "authenticated_delete_users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated select users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated insert users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated update users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated delete users" ON public.users;
CREATE POLICY "authenticated_select_users" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_users" ON public.users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_users" ON public.users FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_users" ON public.users FOR DELETE TO authenticated USING (true);

-- 2. rooms
DROP POLICY IF EXISTS "authenticated_select_rooms" ON public.rooms;
DROP POLICY IF EXISTS "authenticated_insert_rooms" ON public.rooms;
DROP POLICY IF EXISTS "authenticated_update_rooms" ON public.rooms;
DROP POLICY IF EXISTS "authenticated_delete_rooms" ON public.rooms;
CREATE POLICY "authenticated_select_rooms" ON public.rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_rooms" ON public.rooms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_rooms" ON public.rooms FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_rooms" ON public.rooms FOR DELETE TO authenticated USING (true);

-- 3. histories
DROP POLICY IF EXISTS "authenticated_select_histories" ON public.histories;
DROP POLICY IF EXISTS "authenticated_insert_histories" ON public.histories;
DROP POLICY IF EXISTS "authenticated_update_histories" ON public.histories;
DROP POLICY IF EXISTS "authenticated_delete_histories" ON public.histories;
CREATE POLICY "authenticated_select_histories" ON public.histories FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_histories" ON public.histories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_histories" ON public.histories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_histories" ON public.histories FOR DELETE TO authenticated USING (true);

-- 4. level_guides
DROP POLICY IF EXISTS "authenticated_select_level_guides" ON public.level_guides;
DROP POLICY IF EXISTS "authenticated_insert_level_guides" ON public.level_guides;
DROP POLICY IF EXISTS "authenticated_update_level_guides" ON public.level_guides;
DROP POLICY IF EXISTS "authenticated_delete_level_guides" ON public.level_guides;
CREATE POLICY "authenticated_select_level_guides" ON public.level_guides FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_level_guides" ON public.level_guides FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_level_guides" ON public.level_guides FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_level_guides" ON public.level_guides FOR DELETE TO authenticated USING (true);

-- 5. org_goals
DROP POLICY IF EXISTS "authenticated_select_org_goals" ON public.org_goals;
DROP POLICY IF EXISTS "authenticated_insert_org_goals" ON public.org_goals;
DROP POLICY IF EXISTS "authenticated_update_org_goals" ON public.org_goals;
DROP POLICY IF EXISTS "authenticated_delete_org_goals" ON public.org_goals;
CREATE POLICY "authenticated_select_org_goals" ON public.org_goals FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_org_goals" ON public.org_goals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_org_goals" ON public.org_goals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_org_goals" ON public.org_goals FOR DELETE TO authenticated USING (true);

-- 6. agent_logs
DROP POLICY IF EXISTS "authenticated_select_agent_logs" ON public.agent_logs;
DROP POLICY IF EXISTS "authenticated_insert_agent_logs" ON public.agent_logs;
DROP POLICY IF EXISTS "authenticated_update_agent_logs" ON public.agent_logs;
DROP POLICY IF EXISTS "authenticated_delete_agent_logs" ON public.agent_logs;
CREATE POLICY "authenticated_select_agent_logs" ON public.agent_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_agent_logs" ON public.agent_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_agent_logs" ON public.agent_logs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_agent_logs" ON public.agent_logs FOR DELETE TO authenticated USING (true);

-- 7. working_style
DROP POLICY IF EXISTS "authenticated_select_working_style" ON public.working_style;
DROP POLICY IF EXISTS "authenticated_insert_working_style" ON public.working_style;
DROP POLICY IF EXISTS "authenticated_update_working_style" ON public.working_style;
DROP POLICY IF EXISTS "authenticated_delete_working_style" ON public.working_style;
CREATE POLICY "authenticated_select_working_style" ON public.working_style FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_working_style" ON public.working_style FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_working_style" ON public.working_style FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_working_style" ON public.working_style FOR DELETE TO authenticated USING (true);
