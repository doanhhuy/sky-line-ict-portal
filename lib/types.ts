export type UserRole = 'admin' | 'head_ict' | 'teacher'

// Matches 'teachers' table
export interface Teacher {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  avatar_url?: string
  department?: string
  created_at?: string
}

export type Profile = Teacher

// Matches 'professional_plans' & 'digital_resources' tables
export interface ProfessionalPlan {
  id: string
  title: string
  category?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  uploaded_by?: string
  file_url: string
  created_at?: string
}

export interface TeachingPlan {
  id: string
  title: string
  description?: string
  grade_level: GradeLevel
  subject_type: SubjectType
  file_url: string
  file_name: string
  uploaded_by?: string
  uploader_name?: string
  academic_year?: string
  semester?: number
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending'
  created_at: string
  updated_at?: string
}

export type DigitalResource = TeachingPlan

export type GradeLevel = 'primary' | 'middle' | 'high' | 'tieu_hoc' | 'thcs' | 'thpt'
export type SubjectType = 'informatics' | 'stem_robotics' | 'ai' | 'tin_hoc' | 'other' | 'khac'

export const GRADE_LEVEL_LABELS: Record<string, string> = {
  primary: 'Tiểu học',
  tieu_hoc: 'Tiểu học',
  middle: 'THCS',
  thcs: 'THCS',
  high: 'THPT',
  thpt: 'THPT',
}

export const SUBJECT_TYPE_LABELS: Record<string, string> = {
  informatics: 'Tin học',
  tin_hoc: 'Tin học',
  stem_robotics: 'STEM Robotics',
  ai: 'Trí tuệ nhân tạo (AI)',
  other: 'Khác',
  khac: 'Khác',
}

// Matches 'equipments' table
export type EquipmentStatus = 'available' | 'in_use' | 'maintenance' | 'broken'
export type EquipmentCategory = 'computer' | 'pc' | 'robotics_kit' | 'vr_set' | 'drone' | 'projector' | 'other'

export interface Equipment {
  id: string
  code?: string
  name: string
  category: EquipmentCategory
  status: EquipmentStatus
  location: string
  notes?: string
  serial_number?: string
  last_maintenance?: string
  created_at?: string
}

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  available: 'Sẵn sàng',
  in_use: 'Đang sử dụng',
  maintenance: 'Bảo trì',
  broken: 'Hỏng',
}

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  computer: 'Máy tính PC',
  pc: 'Máy tính PC',
  robotics_kit: 'Bộ Robotics (WhalesBot)',
  vr_set: 'Thiết bị VR',
  drone: 'Drone giáo dục',
  projector: 'Máy chiếu',
  other: 'Khác (VR, TB phụ)',
}

// Matches 'equipment_bookings' table
export interface EquipmentBooking {
  id: string
  equipment_id: string
  equipment_name?: string
  teacher_id?: string
  booked_by?: string
  booker_name?: string
  date: string
  start_time: string
  end_time: string
  purpose: string
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

// Matches 'equipment_incidents' table
export interface IncidentReport {
  id: string
  equipment_id: string
  equipment_name?: string
  reported_by?: string
  reporter_name?: string
  title?: string
  description?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  image_url?: string
  image_urls?: string[]
  status: 'open' | 'in_progress' | 'resolved'
  created_at?: string
  resolved_at?: string
}

export const SEVERITY_LABELS: Record<string, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Nghiêm trọng',
}

// Matches 'stem_projects' table
export type ProjectStatus = 'idea' | 'planning' | 'in_progress' | 'review' | 'completed'

export interface StemProject {
  id: string
  project_name?: string
  title: string
  description?: string
  category?: string
  status: ProjectStatus
  lead_student?: string
  team_members?: string | string[]
  mentor?: string
  competition_name?: string
  deadline?: string
  target_date?: string
  academic_year?: string
  budget?: number
  spent?: number
  start_date?: string
  repository_url?: string
  blueprint_url?: string
  milestones: ProjectMilestone[]
  created_at: string
  updated_at?: string
}

export interface ProjectMilestone {
  id: string
  title: string
  completed: boolean
  due_date?: string
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: 'Ý tưởng',
  planning: 'Lên kế hoạch',
  in_progress: 'Đang thực hiện',
  review: 'Đánh giá',
  completed: 'Hoàn thành',
}

// Dashboard stats
export interface DashboardStats {
  totalTeachers: number
  activeDevices: number
  pendingApprovals: number
  ongoingProjects: number
}
