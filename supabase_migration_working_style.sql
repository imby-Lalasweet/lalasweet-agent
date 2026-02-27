-- Working Style table (global, single record)
CREATE TABLE IF NOT EXISTS working_style (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE working_style ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read working_style" ON working_style FOR SELECT USING (true);
CREATE POLICY "anyone can insert working_style" ON working_style FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update working_style" ON working_style FOR UPDATE USING (true);
CREATE POLICY "anyone can delete working_style" ON working_style FOR DELETE USING (true);
