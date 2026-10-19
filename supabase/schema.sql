-- ==============================================================================
-- Sky-Line ICT Portal - Database Schema & Supabase Setup
-- Designed for: Head of ICT Department, Sky-Line Education System, Vietnam
-- ==============================================================================

-- 1. Profiles Table (Sync with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'head_ict', 'teacher')),
  avatar_url TEXT,
  department TEXT DEFAULT 'Bộ môn Tin học & STEM',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Module 1: Teaching Plans & Professional Documents (Quản lý Chuyên môn)
CREATE TABLE IF NOT EXISTS public.teaching_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  grade_level TEXT NOT NULL CHECK (grade_level IN ('primary', 'middle', 'high')),
  subject_type TEXT NOT NULL CHECK (subject_type IN ('informatics', 'stem_robotics', 'ai', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploader_name TEXT,
  academic_year TEXT NOT NULL DEFAULT '2024-2025',
  semester INT NOT NULL DEFAULT 1 CHECK (semester IN (1, 2)),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.teaching_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view teaching plans" ON public.teaching_plans FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert teaching plans" ON public.teaching_plans FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their plans or admin can update" ON public.teaching_plans FOR UPDATE USING (true);

-- 3. Module 2: Equipment & Lab Management (Quản lý Thiết bị & Phòng Lab)
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('computer', 'robotics_kit', 'vr_set', 'projector', 'other')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'broken')),
  location TEXT NOT NULL,
  serial_number TEXT,
  notes TEXT,
  last_maintenance TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage equipment" ON public.equipment FOR ALL USING (auth.role() = 'authenticated');

-- Equipment Bookings (Đặt lịch phòng Lab & Thiết bị)
CREATE TABLE IF NOT EXISTS public.equipment_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  equipment_name TEXT,
  booked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booker_name TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.equipment_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view equipment bookings" ON public.equipment_bookings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert equipment bookings" ON public.equipment_bookings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update bookings" ON public.equipment_bookings FOR UPDATE USING (auth.role() = 'authenticated');

-- Incident Reports (Báo cáo sự cố thiết bị)
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  equipment_name TEXT,
  reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  image_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view incident reports" ON public.incident_reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report incidents" ON public.incident_reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Module 3: STEM Competitions & Projects (Quản lý Dự án STEM & Cuộc thi)
CREATE TABLE IF NOT EXISTS public.stem_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'planning', 'in_progress', 'review', 'completed')),
  team_members TEXT NOT NULL,
  mentor TEXT NOT NULL,
  competition_name TEXT,
  deadline DATE,
  repository_url TEXT,
  blueprint_url TEXT,
  milestones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.stem_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view stem projects" ON public.stem_projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage stem projects" ON public.stem_projects FOR ALL USING (auth.role() = 'authenticated');

-- 5. Storage Buckets Setup
-- Run these commands in Supabase Dashboard -> Storage or SQL Editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('incidents', 'incidents', true) ON CONFLICT DO NOTHING;
