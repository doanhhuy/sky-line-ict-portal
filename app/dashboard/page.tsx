'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Monitor,
  ClipboardCheck,
  Rocket,
  BookOpen,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import type { DashboardStats, TeachingPlan, EquipmentBooking, StemProject } from '@/lib/types'

// Demo data fallbacks
function getDemoStats(): DashboardStats {
  return {
    totalTeachers: 24,
    activeDevices: 156,
    pendingApprovals: 7,
    ongoingProjects: 12,
  }
}

function getDemoRecentPlans(): TeachingPlan[] {
  return [
    {
      id: '1',
      title: 'Kế hoạch giảng dạy Tin học 10 - HK1',
      description: 'Kế hoạch chi tiết theo chuẩn GDPT 2018',
      grade_level: 'high',
      subject_type: 'informatics',
      file_url: '#',
      file_name: 'KHGD_Tin10_HK1.pdf',
      uploaded_by: 'user1',
      uploader_name: 'Trần Thị B',
      academic_year: '2024-2025',
      semester: 1,
      status: 'submitted',
      created_at: '2024-10-16T08:00:00Z',
      updated_at: '2024-10-16T08:00:00Z',
    },
    {
      id: '2',
      title: 'Giáo án Chuyên đề STEM Robotics - Khối 7',
      description: 'Lập trình cảm biến siêu âm với WhalesBot',
      grade_level: 'middle',
      subject_type: 'stem_robotics',
      file_url: '#',
      file_name: 'STEM_Robotics_K7.docx',
      uploaded_by: 'user2',
      uploader_name: 'Lê Văn C',
      academic_year: '2024-2025',
      semester: 1,
      status: 'approved',
      created_at: '2024-10-15T09:00:00Z',
      updated_at: '2024-10-15T10:00:00Z',
    },
    {
      id: '3',
      title: 'Đề cương Ứng dụng Trí tuệ nhân tạo (AI) Tiểu học',
      description: 'Khám phá Machine Learning qua Teachable Machine',
      grade_level: 'primary',
      subject_type: 'ai',
      file_url: '#',
      file_name: 'DeCuong_AI_Primary.pdf',
      uploaded_by: 'user3',
      uploader_name: 'Hoàng Minh E',
      academic_year: '2024-2025',
      semester: 1,
      status: 'submitted',
      created_at: '2024-10-14T11:00:00Z',
      updated_at: '2024-10-14T11:00:00Z',
    },
  ]
}

function getDemoBookings(): EquipmentBooking[] {
  return [
    {
      id: '1',
      equipment_id: 'eq1',
      equipment_name: 'Phòng Lab Tin học A1 (32 Máy tính trạm)',
      booked_by: 'user1',
      booker_name: 'Trần Thị B',
      date: '2024-10-16',
      start_time: '08:00',
      end_time: '09:30',
      purpose: 'Thực hành Lập trình Python 10A1',
      status: 'confirmed',
      created_at: '2024-10-15T08:00:00Z',
    },
    {
      id: '2',
      equipment_id: 'eq2',
      equipment_name: 'Bộ Kit WhalesBot Robotics (20 bộ)',
      booked_by: 'user2',
      booker_name: 'Lê Văn C',
      date: '2024-10-16',
      start_time: '14:00',
      end_time: '16:00',
      purpose: 'Huấn luyện Đội tuyển WRO Bảng B',
      status: 'pending',
      created_at: '2024-10-15T14:00:00Z',
    },
  ]
}

function getDemoProjects(): StemProject[] {
  return [
    {
      id: '1',
      title: 'Hệ thống Thùng rác Phân loại Tự động bằng AI',
      description: 'Sử dụng Computer Vision nhận diện rác tái chế',
      competition_name: 'Hội thi Tin học Trẻ Đà Nẵng 2025',
      category: 'ai_iot',
      status: 'in_progress',
      lead_student: 'Nguyễn Quốc Bảo (11A1)',
      team_members: 'Nguyễn Quốc Bảo, Lê Hoàng Nam',
      mentor: 'Trần Thị B',
      academic_year: '2024-2025',
      start_date: '2024-10-01',
      target_date: '2025-03-15',
      budget: 8500000,
      spent: 4200000,
      milestones: [
        { id: 'm1', title: 'Thiết kế mô hình 3D', due_date: '2024-11-01', completed: true },
        { id: 'm2', title: 'Train model YOLOv8', due_date: '2024-12-15', completed: true },
        { id: 'm3', title: 'Tích hợp mạch vi điều khiển', due_date: '2025-01-20', completed: false },
      ],
      created_at: '2024-10-01T08:00:00Z',
      updated_at: '2024-10-15T08:00:00Z',
    },
    {
      id: '2',
      title: 'Robot Cứu nạn Vượt địa hình Sky-Bot',
      description: 'Robot leo thang cứu hộ đạt chuẩn WRO Rescue',
      competition_name: 'World Robot Olympiad (WRO) 2025',
      category: 'robotics',
      status: 'planning',
      lead_student: 'Đặng Mai Phương (8/2)',
      team_members: 'Đặng Mai Phương, Trần Hữu Phúc',
      mentor: 'Lê Văn C',
      academic_year: '2024-2025',
      start_date: '2024-11-15',
      target_date: '2025-05-20',
      budget: 15000000,
      spent: 3000000,
      milestones: [
        { id: 'm4', title: 'Khung gầm và truyền động', due_date: '2024-12-30', completed: true },
        { id: 'm5', title: 'Thuật toán dò line quang học', due_date: '2025-02-15', completed: false },
      ],
      created_at: '2024-10-05T08:00:00Z',
      updated_at: '2024-10-15T08:00:00Z',
    },
  ]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentPlans, setRecentPlans] = useState<TeachingPlan[]>([])
  const [todayBookings, setTodayBookings] = useState<EquipmentBooking[]>([])
  const [projects, setProjects] = useState<StemProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const supabase = createClient()

        const { data: plansData } = await supabase
          .from('professional_plans')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        const { data: bookingsData } = await supabase
          .from('equipment_bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        const { data: projectsData } = await supabase
          .from('stem_projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        const { count: teacherCount } = await supabase
          .from('teachers')
          .select('*', { count: 'exact', head: true })

        const { count: deviceCount } = await supabase
          .from('equipments')
          .select('*', { count: 'exact', head: true })

        const mappedProjects = projectsData?.map((p: any) => ({
          ...p,
          title: p.title || p.project_name || 'Dự án STEM',
          milestones: p.milestones || [],
        }))

        const mappedPlans = plansData?.map((p: any) => ({
          ...p,
          title: p.title || 'Kế hoạch chuyên môn',
          file_name: p.file_name || 'Tài liệu.pdf',
          uploader_name: p.author || p.uploader_name || 'Giáo viên bộ môn',
          status: p.status || 'submitted',
        }))

        setRecentPlans(mappedPlans?.length ? mappedPlans : getDemoRecentPlans())
        setTodayBookings(bookingsData?.length ? bookingsData : getDemoBookings())
        setProjects(mappedProjects?.length ? mappedProjects : getDemoProjects())

        const demo = getDemoStats()
        setStats({
          ...demo,
          totalTeachers: teacherCount ?? demo.totalTeachers,
          activeDevices: deviceCount ?? demo.activeDevices,
        })
      } catch {
        setStats(getDemoStats())
        setRecentPlans(getDemoRecentPlans())
        setTodayBookings(getDemoBookings())
        setProjects(getDemoProjects())
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 rounded-xl bg-slate-100 animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-100 animate-shimmer" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Executive Command Strip (Single memorable centerpiece) */}
      <div className="bg-[#091e42] rounded-xl text-white p-6 sm:p-7 relative overflow-hidden shadow-sm border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800/60">
                Bàn Điều Hành Chuyên Môn
              </span>
              <span className="text-xs text-slate-300">
                Hệ thống Giáo dục Sky-Line · Năm học 2024-2025
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Báo cáo tiến độ & Hoạt động Tổ Tin học - STEM
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Theo dõi việc phê duyệt giáo án chuyên môn, quản trị phòng máy thực hành và tiến độ thi đấu khoa học kỹ thuật của học sinh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/professional"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Ký duyệt kế hoạch ({stats?.pendingApprovals || 0})</span>
            </Link>
            <Link
              href="/dashboard/equipment"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-colors"
            >
              <Monitor className="w-4 h-4" />
              <span>Xem phòng Lab</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Overview */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Đội ngũ giáo viên"
            value={stats.totalTeachers}
            subtitle="Tổ Tin học & STEM"
            icon={Users}
            color="blue"
            trend={{ value: 8, label: 'so với năm học trước' }}
          />
          <StatCard
            title="Thiết bị Lab hoạt động"
            value={stats.activeDevices}
            subtitle="Máy trạm, Robot, VR"
            icon={Monitor}
            color="emerald"
            trend={{ value: 100, label: 'hoạt động ổn định' }}
          />
          <StatCard
            title="Hồ sơ chờ phê duyệt"
            value={stats.pendingApprovals}
            subtitle="Giáo án & đề cương"
            icon={ClipboardCheck}
            color="amber"
          />
          <StatCard
            title="Dự án STEM & WRO"
            value={stats.ongoingProjects}
            subtitle="Đang bồi dưỡng"
            icon={Rocket}
            color="purple"
            trend={{ value: 25, label: 'tăng số lượng đề tài' }}
          />
        </div>
      )}

      {/* Main 2-Column Work Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8/12): Professional Management & STEM Tracks */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Teaching Plans Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Hồ sơ chuyên môn cần duyệt gần đây
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Kế hoạch giảng dạy & đề cương bài học đã nộp
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/professional"
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentPlans.map((plan) => {
                const isPending = plan.status === 'submitted' || (plan.status as string) === 'pending'
                return (
                  <div
                    key={plan.id}
                    className="p-4 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isPending ? 'status-dot status-dot-pending' : 'status-dot status-dot-active'
                          }
                        />
                        <h3 className="text-xs font-semibold text-slate-900 truncate">
                          {plan.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 pl-4 flex items-center gap-2">
                        <span>GV: {plan.uploader_name || 'Bộ môn Tin học'}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400">{plan.file_name}</span>
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Badge variant={isPending ? 'warning' : 'success'}>
                        {isPending ? 'Chờ duyệt' : 'Đã duyệt'}
                      </Badge>
                      <Link
                        href="/dashboard/professional"
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                      >
                        Kiểm tra
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* STEM Projects Pipeline Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Đề tài & Đội tuyển STEM nổi bật
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Chuẩn bị tham gia Tin học trẻ, WRO & Hội thi KHKT
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/projects"
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <span>Xem đường đua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 space-y-3.5">
              {projects.map((proj) => {
                const total = proj.milestones?.length || 1
                const done = proj.milestones?.filter((m) => m.completed).length || 0
                const pct = Math.round((done / total) * 100)

                return (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {proj.competition_name} · Hướng dẫn: <span className="font-semibold text-slate-700">{proj.mentor}</span>
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {pct}% hoàn tất
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5/12): Lab Today & Quick Operations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Lab Schedule */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Lịch phòng Lab hôm nay
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Các ca máy và thiết bị thực hành được điều phối
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/equipment"
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <span>Xem sơ đồ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {todayBookings.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Không có ca thực hành đăng ký trong hôm nay
                </div>
              ) : (
                todayBookings.map((b) => (
                  <div key={b.id} className="p-4 space-y-1.5 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                        {b.start_time} - {b.end_time}
                      </span>
                      <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'}>
                        {b.status === 'confirmed' ? 'Đã xếp ca' : 'Chờ xác nhận'}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">
                      {b.equipment_name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      GV: {b.booker_name} · Mục đích: {b.purpose}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Operational Quick Actions Panel */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Tác vụ nhanh bộ môn</h2>
              <p className="text-[11px] text-slate-500">
                Thao tác thường nhật của giáo viên và tổ trưởng
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/professional"
                className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 text-left transition-all group"
              >
                <FileText className="w-4 h-4 text-sky-600 mb-1.5 group-hover:scale-105 transition-transform" />
                <span className="block text-xs font-semibold text-slate-800">
                  Nộp tài liệu
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  Tải lên kế hoạch & bài giảng
                </span>
              </Link>

              <Link
                href="/dashboard/equipment"
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <Monitor className="w-4 h-4 text-emerald-600 mb-1.5 group-hover:scale-105 transition-transform" />
                <span className="block text-xs font-semibold text-slate-800">
                  Mượn phòng Lab
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  Đăng ký ca máy hoặc robot
                </span>
              </Link>

              <Link
                href="/dashboard/equipment"
                className="p-3 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-left transition-all group"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 mb-1.5 group-hover:scale-105 transition-transform" />
                <span className="block text-xs font-semibold text-slate-800">
                  Báo sự cố
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  Kỹ thuật hỗ trợ ngay
                </span>
              </Link>

              <Link
                href="/dashboard/projects"
                className="p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-all group"
              >
                <Rocket className="w-4 h-4 text-purple-600 mb-1.5 group-hover:scale-105 transition-transform" />
                <span className="block text-xs font-semibold text-slate-800">
                  Tạo đề tài STEM
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  Lập hồ sơ đội tuyển thi đấu
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
