'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Plus,
  Users,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Circle,
  Loader2,
  GitBranch,
  FileCode,
  User,
  LayoutGrid,
  List,
  Sparkles,
  Check,
} from 'lucide-react'
import {
  type StemProject,
  type ProjectStatus,
  type ProjectMilestone,
  PROJECT_STATUS_LABELS,
} from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'

const DEMO_PROJECTS: StemProject[] = [
  {
    id: '1',
    title: 'Hệ thống Thùng rác Phân loại Tự động bằng AI',
    description: 'Thiết kế mô hình nhận diện và phân loại rác thải tự động sử dụng Computer Vision và cảm biến tiệm cận.',
    status: 'in_progress',
    category: 'ai_iot',
    lead_student: 'Nguyễn Quốc Bảo (11A1)',
    team_members: 'Nguyễn Quốc Bảo, Lê Hoàng Nam, Trần Bảo Anh',
    mentor: 'Trần Thị B',
    competition_name: 'Hội thi Tin học Trẻ Đà Nẵng 2025',
    target_date: '2025-03-15',
    budget: 8500000,
    spent: 4200000,
    repository_url: 'https://github.com/skyline-stem/ai-trash-sorter',
    milestones: [
      { id: '1', title: 'Thu thập dataset 3000 ảnh rác thải', completed: true, due_date: '2024-11-01' },
      { id: '2', title: 'Train model YOLOv8 Edge AI', completed: true, due_date: '2024-12-15' },
      { id: '3', title: 'Gia công thùng chứa cơ khí & servo', completed: false, due_date: '2025-01-20' },
      { id: '4', title: 'Thử nghiệm thực tế tại sảnh trường', completed: false, due_date: '2025-02-15' },
    ],
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-10-14T00:00:00Z',
  },
  {
    id: '2',
    title: 'Robot Cứu nạn Vượt địa hình Sky-Bot',
    description: 'Chế tạo robot cứu hộ leo thang đạt chuẩn WRO Rescue với cảm biến siêu âm và camera truyền hình ảnh trực tiếp.',
    status: 'in_progress',
    category: 'robotics',
    lead_student: 'Đặng Mai Phương (8/2)',
    team_members: 'Đặng Mai Phương, Trần Hữu Phúc',
    mentor: 'Lê Văn C',
    competition_name: 'World Robot Olympiad (WRO) 2025',
    target_date: '2025-05-20',
    budget: 15000000,
    spent: 6500000,
    repository_url: 'https://github.com/skyline-stem/wro-rescue-bot',
    milestones: [
      { id: '5', title: 'Thiết kế cơ cấu gầm bánh xích', completed: true, due_date: '2024-11-15' },
      { id: '6', title: 'Lắp mạch vi điều khiển STM32', completed: true, due_date: '2024-12-20' },
      { id: '7', title: 'Thuật toán dò line quang học', completed: false, due_date: '2025-02-10' },
    ],
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-12T00:00:00Z',
  },
  {
    id: '3',
    title: 'Hệ thống Nhà lưới Nông nghiệp Thông minh IoT',
    description: 'Giám sát độ ẩm đất, nhiệt độ và tự động tưới nước qua giao thức MQTT và bảng điều khiển trực quan.',
    status: 'planning',
    category: 'ai_iot',
    lead_student: 'Đinh Hào (9/1)',
    team_members: 'Đinh Hào, Ngô Khánh',
    mentor: 'Hoàng Minh E',
    competition_name: 'Hội thi Khoa học Kỹ thuật Cấp Thành Phố',
    target_date: '2025-04-10',
    budget: 6000000,
    spent: 1200000,
    milestones: [
      { id: '8', title: 'Xây dựng thuyết minh đề tài', completed: true, due_date: '2024-10-25' },
      { id: '9', title: 'Lắp ráp mô hình nhà kính mini', completed: false, due_date: '2024-12-30' },
    ],
    created_at: '2024-10-10T00:00:00Z',
    updated_at: '2024-10-10T00:00:00Z',
  },
  {
    id: '4',
    title: 'Drone Trinh sát & Lập bản đồ trường học bằng LiDAR',
    description: 'Ứng dụng bay tự động quét không gian 3D khuôn viên Sky-Line phục vụ sơ tán khẩn cấp.',
    status: 'review',
    category: 'robotics',
    lead_student: 'Lý Thành (12A2)',
    team_members: 'Lý Thành, Bùi Yến, Trương Phúc',
    mentor: 'Trần Thị B',
    competition_name: 'FIRST Tech Challenge',
    target_date: '2025-02-15',
    budget: 18000000,
    spent: 14000000,
    repository_url: 'https://github.com/skyline-stem/drone-lidar',
    milestones: [
      { id: '10', title: 'Cân chỉnh firmware bay PX4', completed: true, due_date: '2024-09-30' },
      { id: '11', title: 'Tích hợp cảm biến LiDAR', completed: true, due_date: '2024-10-30' },
      { id: '12', title: 'Báo cáo kỹ thuật cho Hội đồng', completed: true, due_date: '2024-11-20' },
    ],
    created_at: '2024-09-15T00:00:00Z',
    updated_at: '2024-10-13T00:00:00Z',
  },
  {
    id: '5',
    title: 'Xe đua Mô hình Năng lượng Mặt trời Tối ưu Khí động học',
    description: 'Thiết kế thân vỏ sợi thủy tinh siêu nhẹ, thu năng lượng mặt trời hiệu suất cao.',
    status: 'completed',
    category: 'other',
    lead_student: 'Võ Quang (10B1)',
    team_members: 'Võ Quang, Trịnh Nhân',
    mentor: 'Lê Văn C',
    competition_name: 'Solar Car Challenge Vietnam 2024',
    target_date: '2024-09-30',
    budget: 10000000,
    spent: 9800000,
    milestones: [
      { id: '13', title: 'Đo thử nghiệm hầm gió ảo CFD', completed: true },
      { id: '14', title: 'Thi công mô hình thực tế', completed: true },
      { id: '15', title: 'Đoạt giải Nhì cấp Quốc gia', completed: true },
    ],
    created_at: '2024-07-01T00:00:00Z',
    updated_at: '2024-09-30T00:00:00Z',
  },
]

const PIPELINE_COLUMNS: { status: ProjectStatus; title: string; colorDot: string }[] = [
  { status: 'idea', title: 'Ý tưởng & Đề xuất', colorDot: 'bg-slate-400' },
  { status: 'planning', title: 'Lập kế hoạch & Thiết kế', colorDot: 'bg-sky-500' },
  { status: 'in_progress', title: 'Chế tạo & Thử nghiệm', colorDot: 'bg-amber-500' },
  { status: 'review', title: 'Hội đồng Thẩm định', colorDot: 'bg-purple-500' },
  { status: 'completed', title: 'Đạt giải / Hoàn thành', colorDot: 'bg-emerald-500' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<StemProject[]>(DEMO_PROJECTS)
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedProject, setSelectedProject] = useState<StemProject | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    competition_name: '',
    lead_student: '',
    mentor: 'Trần Thị B',
    target_date: '',
  })

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('stem_projects').select('*')
        if (data && data.length > 0) {
          setProjects(
            data.map((p: any) => ({
              ...p,
              title: p.title || p.project_name || 'Đề tài STEM',
              milestones: p.milestones || [],
              category: p.category || 'robotics',
            }))
          )
        }
      } catch {}
    }
    loadProjects()
  }, [])

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.competition_name) return

    const newProj: StemProject = {
      id: `p-${Date.now()}`,
      title: form.title,
      description: form.description,
      competition_name: form.competition_name,
      status: 'planning',
      lead_student: form.lead_student || 'Học sinh Sky-Line',
      team_members: form.lead_student || 'Nhóm học sinh',
      mentor: form.mentor,
      target_date: form.target_date || '2025-05-01',
      budget: 5000000,
      spent: 0,
      milestones: [
        { id: 'm1', title: 'Soạn thảo đề cương nghiên cứu', completed: true },
        { id: 'm2', title: 'Thiết kế nguyên mẫu ban đầu', completed: false },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setProjects([newProj, ...projects])
    setShowCreate(false)
    setForm({
      title: '',
      description: '',
      competition_name: '',
      lead_student: '',
      mentor: 'Trần Thị B',
      target_date: '',
    })
  }

  function toggleMilestone(projectId: string, milestoneId: string) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        const updated = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        )
        return { ...p, milestones: updated }
      })
    )

    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              milestones: prev.milestones.map((m) =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
              ),
            }
          : null
      )
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Đề Tài Nghiên Cứu STEM & Đội Tuyển Sáng Chế
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              {projects.length} Đề tài
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tiến độ chế tạo, huấn luyện học sinh dự thi WRO, Tin học trẻ và Ngày hội STEM
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1',
                viewMode === 'kanban' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tiến trình</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1',
                viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <List className="w-3.5 h-3.5" />
              <span>Bảng kê</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#091e42] hover:bg-sky-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Đăng ký đề tài mới</span>
          </button>
        </div>
      </div>

      {/* Pipeline Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((col) => {
            const colProjects = projects.filter((p) => p.status === col.status)
            return (
              <div
                key={col.status}
                className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 space-y-3 min-w-[230px]"
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full', col.colorDot)} />
                    <h3 className="text-xs font-bold text-slate-800 truncate">
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {colProjects.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5">
                  {colProjects.map((p) => {
                    const totalM = p.milestones.length || 1
                    const doneM = p.milestones.filter((m) => m.completed).length
                    const pct = Math.round((doneM / totalM) * 100)

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all space-y-2.5"
                      >
                        <div>
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                            {p.competition_name}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                            {p.title}
                          </h4>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-1">
                          <p>
                            HS: <span className="text-slate-700 font-medium">{p.lead_student || 'Đội tuyển'}</span>
                          </p>
                          <p>
                            GVHD: <span className="text-slate-700 font-medium">{p.mentor}</span>
                          </p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1 pt-1 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Tiến độ cột mốc</span>
                            <span className="font-mono font-semibold text-slate-700">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-purple-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {colProjects.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-[11px]">
                      Chưa có đề tài
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                <th className="px-5 py-3">Tên đề tài & Sáng chế</th>
                <th className="px-4 py-3">Hội thi / Đấu trường</th>
                <th className="px-4 py-3">Học sinh chủ nhiệm</th>
                <th className="px-4 py-3">Giáo viên hướng dẫn</th>
                <th className="px-4 py-3">Tiến độ</th>
                <th className="px-4 py-3">Kinh phí đã cấp</th>
                <th className="px-5 py-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const totalM = p.milestones.length || 1
                const doneM = p.milestones.filter((m) => m.completed).length
                const pct = Math.round((doneM / totalM) * 100)

                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className="table-row-hover cursor-pointer"
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-[280px]">
                      {p.title}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{p.competition_name}</td>
                    <td className="px-4 py-3.5 text-slate-700">{p.lead_student || 'Nhóm nghiên cứu'}</td>
                    <td className="px-4 py-3.5 text-slate-700">{p.mentor}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-mono font-semibold text-purple-700">{pct}%</span>
                      <span className="text-slate-400 text-[11px] ml-1">({doneM}/{totalM})</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600">
                      {p.budget ? `${(p.budget / 1000000).toFixed(1)} tr VNĐ` : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <Badge variant="purple">
                        {PROJECT_STATUS_LABELS[p.status] || p.status}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Detail Modal & Milestone Checklist */}
      {selectedProject && (
        <Modal
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title="Hồ sơ Chi tiết Đề tài STEM"
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {selectedProject.competition_name}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Học sinh: {selectedProject.lead_student} · GVHD: {selectedProject.mentor}
                  </p>
                </div>
                <Badge variant="purple">
                  {PROJECT_STATUS_LABELS[selectedProject.status]}
                </Badge>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200">
                {selectedProject.description}
              </p>
            </div>

            {/* Milestones Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Các cột mốc nghiên cứu & thực nghiệm ({selectedProject.milestones.filter(m => m.completed).length}/{selectedProject.milestones.length})
              </h4>
              <div className="space-y-1.5">
                {selectedProject.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(selectedProject.id, m.id)}
                    className={cn(
                      'p-2.5 rounded border flex items-center justify-between text-xs cursor-pointer transition-colors',
                      m.completed ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                          m.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                        )}
                      >
                        {m.completed && <Check className="w-3 h-3" />}
                      </div>
                      <span className={cn(m.completed && 'line-through text-slate-500 font-medium')}>
                        {m.title}
                      </span>
                    </div>

                    {m.due_date && (
                      <span className="font-mono text-[11px] text-slate-400">
                        {m.due_date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedProject.repository_url && (
              <div className="p-3 rounded border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <GitBranch className="w-4 h-4 text-slate-500" />
                  <span>Kho mã nguồn / Thiết kế kỹ thuật</span>
                </div>
                <a
                  href={selectedProject.repository_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Truy cập Github</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Đăng ký Đề tài Nghiên cứu STEM / Cuộc thi mới" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên đề tài / Sáng chế <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ví dụ: Thiết bị cảnh báo lũ thông minh cho vùng trũng"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cuộc thi hoặc Ngày hội mục tiêu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.competition_name}
              onChange={(e) => setForm({ ...form, competition_name: e.target.value })}
              placeholder="Ví dụ: Hội thi Tin học Trẻ 2025 hoặc Robothon WRO"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Học sinh trưởng nhóm
              </label>
              <input
                type="text"
                value={form.lead_student}
                onChange={(e) => setForm({ ...form, lead_student: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn An (10A1)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giáo viên bảo trợ / HD
              </label>
              <input
                type="text"
                value={form.mentor}
                onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả ý tưởng & phương pháp kỹ thuật
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tóm tắt về phần cứng, phần mềm và tính sáng tạo của giải pháp..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#091e42] hover:bg-sky-900 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Tạo hồ sơ đề tài
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
