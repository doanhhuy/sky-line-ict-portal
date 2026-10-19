'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Upload,
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Check,
  X,
  Plus,
  Loader2,
  GraduationCap,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react'
import {
  type TeachingPlan,
  type GradeLevel,
  type SubjectType,
  GRADE_LEVEL_LABELS,
  SUBJECT_TYPE_LABELS,
} from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'

const DEMO_PLANS: TeachingPlan[] = [
  {
    id: '1',
    title: 'Kế hoạch giảng dạy Tin học 10 - HK1',
    description: 'Kế hoạch chi tiết theo chuẩn GDPT 2018 bao gồm 18 tuần thực học',
    grade_level: 'high',
    subject_type: 'informatics',
    file_url: '#',
    file_name: 'KHGD_Tin10_HK1.pdf',
    uploaded_by: 'user1',
    uploader_name: 'Trần Thị B',
    academic_year: '2024-2025',
    semester: 1,
    status: 'approved',
    created_at: '2024-09-01T08:00:00Z',
    updated_at: '2024-09-05T10:00:00Z',
  },
  {
    id: '2',
    title: 'Giáo án Chuyên đề STEM Robotics - Lớp 7',
    description: 'Chuyên đề lắp ráp và lập trình cảm biến siêu âm WhalesBot (12 tiết)',
    grade_level: 'middle',
    subject_type: 'stem_robotics',
    file_url: '#',
    file_name: 'STEM_Robotics_L7.docx',
    uploaded_by: 'user2',
    uploader_name: 'Lê Văn C',
    academic_year: '2024-2025',
    semester: 1,
    status: 'submitted',
    created_at: '2024-09-10T14:30:00Z',
    updated_at: '2024-09-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Đề cương Trí tuệ nhân tạo (AI) Tiểu học',
    description: 'Nhận diện hình ảnh và ứng dụng Teachable Machine cho khối 4-5',
    grade_level: 'primary',
    subject_type: 'ai',
    file_url: '#',
    file_name: 'DeCuong_AI_Primary.pdf',
    uploaded_by: 'user3',
    uploader_name: 'Hoàng Minh E',
    academic_year: '2024-2025',
    semester: 1,
    status: 'approved',
    created_at: '2024-09-15T09:15:00Z',
    updated_at: '2024-09-18T16:00:00Z',
  },
  {
    id: '4',
    title: 'Phân phối chương trình Tin học 11 - Định hướng Tin học ứng dụng',
    description: 'Chương trình chi tiết chuyên đề Hệ điều hành và Phần mềm ứng dụng văn phòng',
    grade_level: 'high',
    subject_type: 'informatics',
    file_url: '#',
    file_name: 'PPCT_Tin11_UngDung.xlsx',
    uploaded_by: 'user1',
    uploader_name: 'Trần Thị B',
    academic_year: '2024-2025',
    semester: 1,
    status: 'approved',
    created_at: '2024-08-25T10:00:00Z',
    updated_at: '2024-08-28T11:00:00Z',
  },
  {
    id: '5',
    title: 'Tài liệu Thực hành Kính thực tế ảo VR trong bài học KHTN',
    description: 'Hướng dẫn sử dụng Meta Quest 2 mô phỏng cấu tạo tế bào và hệ mặt trời',
    grade_level: 'high',
    subject_type: 'stem_robotics',
    file_url: '#',
    file_name: 'VR_KHTN_HuongDan.pdf',
    uploaded_by: 'user4',
    uploader_name: 'Phạm Thị D',
    academic_year: '2024-2025',
    semester: 1,
    status: 'submitted',
    created_at: '2024-10-12T11:00:00Z',
    updated_at: '2024-10-12T11:00:00Z',
  },
  {
    id: '6',
    title: 'Giáo trình Bồi dưỡng Đội tuyển Tin học trẻ - Khối THCS',
    description: 'Thuật toán đồ thị và quy hoạch động căn bản bằng C++/Python',
    grade_level: 'middle',
    subject_type: 'informatics',
    file_url: '#',
    file_name: 'BoiDuong_TinHocTre_THCS.pdf',
    uploaded_by: 'user2',
    uploader_name: 'Lê Văn C',
    academic_year: '2024-2025',
    semester: 1,
    status: 'draft',
    created_at: '2024-10-08T13:00:00Z',
    updated_at: '2024-10-10T09:00:00Z',
  },
]

export default function ProfessionalPage() {
  const [plans, setPlans] = useState<TeachingPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<TeachingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState<GradeLevel | 'all'>('all')
  const [subjectFilter, setSubjectFilter] = useState<SubjectType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'submitted' | 'draft'>('all')

  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedPlanPreview, setSelectedPlanPreview] = useState<TeachingPlan | null>(null)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    grade_level: 'high' as GradeLevel,
    subject_type: 'informatics' as SubjectType,
    academic_year: '2024-2025',
    semester: 1,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    loadPlans()
  }, [])

  useEffect(() => {
    let filtered = plans
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.uploader_name?.toLowerCase().includes(q) ||
          (p.file_name || '').toLowerCase().includes(q)
      )
    }
    if (gradeFilter !== 'all') {
      filtered = filtered.filter((p) => p.grade_level === gradeFilter)
    }
    if (subjectFilter !== 'all') {
      filtered = filtered.filter((p) => p.subject_type === subjectFilter)
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }
    setFilteredPlans(filtered)
  }, [plans, search, gradeFilter, subjectFilter, statusFilter])

  async function loadPlans() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('digital_resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        setPlans(
          data.map((item: any) => ({
            ...item,
            file_name: item.title + '.pdf',
            uploader_name: item.author || 'Tổ Tin học Sky-Line',
            academic_year: '2024-2025',
            semester: 1,
            status: item.status || 'approved',
          }))
        )
      } else {
        setPlans(DEMO_PLANS)
      }
    } catch {
      setPlans(DEMO_PLANS)
    } finally {
      setLoading(false)
    }
  }

  function handleStatusChange(planId: string, newStatus: 'approved' | 'rejected') {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: newStatus } : p))
    )
    if (selectedPlanPreview?.id === planId) {
      setSelectedPlanPreview((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.title || !selectedFile) return
    setUploading(true)

    try {
      const newPlan: TeachingPlan = {
        id: String(Date.now()),
        title: uploadForm.title,
        description: uploadForm.description,
        grade_level: uploadForm.grade_level,
        subject_type: uploadForm.subject_type,
        file_url: '#',
        file_name: selectedFile.name,
        uploaded_by: 'current_user',
        uploader_name: 'Trần Thị B',
        academic_year: uploadForm.academic_year,
        semester: uploadForm.semester,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setPlans([newPlan, ...plans])
      setShowUpload(false)
      setSelectedFile(null)
      setUploadForm({
        title: '',
        description: '',
        grade_level: 'high',
        subject_type: 'informatics',
        academic_year: '2024-2025',
        semester: 1,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Quản lý Chuyên môn & Tài nguyên Số
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
              {filteredPlans.length} tài liệu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kho lưu trữ phân phối chương trình, giáo án số hóa và đề cương bộ môn Tin học & STEM
          </p>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#091e42] hover:bg-sky-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nộp kế hoạch mới</span>
        </button>
      </div>

      {/* Control & Filter Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3.5 shadow-sm">
        {/* Search & Select dropdowns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên bài giảng, giáo viên hoặc mã hồ sơ..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value as SubjectType | 'all')}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="all">Tất cả môn học</option>
              {Object.entries(SUBJECT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="submitted">Đang chờ duyệt</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>

        {/* Grade tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">
            Cấp học:
          </span>
          {[
            { key: 'all', label: 'Tất cả khối' },
            { key: 'primary', label: 'Tiểu học' },
            { key: 'middle', label: 'THCS (Khối 6-9)' },
            { key: 'high', label: 'THPT (Khối 10-12)' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setGradeFilter(tab.key as any)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0',
                gradeFilter === tab.key
                  ? 'bg-sky-100 text-sky-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 text-sky-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 mt-2 font-medium">Đang tải hồ sơ chuyên môn...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-700 font-medium text-sm">Không tìm thấy tài liệu phù hợp</p>
            <p className="text-xs text-slate-400">
              Vui lòng điều chỉnh bộ lọc hoặc tạo hồ sơ kế hoạch mới
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3">Tài liệu & Kế hoạch</th>
                  <th className="px-4 py-3">Cấp học</th>
                  <th className="px-4 py-3">Môn học</th>
                  <th className="px-4 py-3">Người nộp</th>
                  <th className="px-4 py-3">Ngày gửi</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPlans.map((plan) => {
                  const isSubmitted = plan.status === 'submitted'
                  const isApproved = plan.status === 'approved'
                  return (
                    <tr key={plan.id} className="table-row-hover">
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 text-sky-700 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 leading-snug">
                              {plan.title}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {plan.file_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          {GRADE_LEVEL_LABELS[plan.grade_level]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-slate-700 font-medium">
                          {SUBJECT_TYPE_LABELS[plan.subject_type]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                        {plan.uploader_name}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {plan.created_at ? formatDate(plan.created_at) : '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={
                              isApproved
                                ? 'status-dot status-dot-active'
                                : isSubmitted
                                ? 'status-dot status-dot-pending'
                                : 'status-dot'
                            }
                          />
                          <span
                            className={cn(
                              'text-xs font-semibold',
                              isApproved ? 'text-emerald-700' : isSubmitted ? 'text-amber-700' : 'text-slate-600'
                            )}
                          >
                            {isApproved ? 'Đã duyệt' : isSubmitted ? 'Chờ duyệt' : 'Bản nháp'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelectedPlanPreview(plan)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-sky-700 transition-colors"
                            title="Xem chi tiết đề cương"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={plan.file_url || '#'}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-emerald-700 transition-colors"
                            title="Tải tệp đính kèm"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          {isSubmitted && (
                            <>
                              <button
                                onClick={() => handleStatusChange(plan.id, 'approved')}
                                className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 transition-colors"
                                title="Phê duyệt kế hoạch"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleStatusChange(plan.id, 'rejected')}
                                className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-[11px] border border-rose-200 transition-colors"
                                title="Yêu cầu chỉnh sửa"
                              >
                                Từ chối
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Detail Preview Modal */}
      {selectedPlanPreview && (
        <Modal
          open={!!selectedPlanPreview}
          onClose={() => setSelectedPlanPreview(null)}
          title="Chi tiết Hồ sơ Chuyên môn"
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedPlanPreview.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tác giả: {selectedPlanPreview.uploader_name} · Năm học: {selectedPlanPreview.academic_year} (HK {selectedPlanPreview.semester})
                  </p>
                </div>
                <Badge variant={selectedPlanPreview.status === 'approved' ? 'success' : 'warning'}>
                  {selectedPlanPreview.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                </Badge>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200">
                {selectedPlanPreview.description || 'Chưa có tóm tắt nội dung chi tiết.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Cấp học</span>
                <span className="font-semibold text-slate-800">
                  {GRADE_LEVEL_LABELS[selectedPlanPreview.grade_level]}
                </span>
              </div>
              <div className="p-3 rounded border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Bộ môn</span>
                <span className="font-semibold text-slate-800">
                  {SUBJECT_TYPE_LABELS[selectedPlanPreview.subject_type]}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-sky-100 bg-sky-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-sky-700" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    {selectedPlanPreview.file_name}
                  </p>
                  <p className="text-[11px] text-slate-500">Tài liệu đính kèm chính thức</p>
                </div>
              </div>
              <a
                href={selectedPlanPreview.file_url || '#'}
                className="px-3 py-1.5 rounded bg-sky-600 text-white text-xs font-medium hover:bg-sky-500 transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tài liệu</span>
              </a>
            </div>

            {selectedPlanPreview.status === 'submitted' && (
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleStatusChange(selectedPlanPreview.id, 'rejected')}
                  className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs border border-rose-200"
                >
                  Yêu cầu biên soạn lại
                </button>
                <button
                  onClick={() => handleStatusChange(selectedPlanPreview.id, 'approved')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-semibold text-xs shadow-sm"
                >
                  Ký duyệt hồ sơ
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Nộp tài liệu giảng dạy / Chuyên đề mới" size="lg">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên kế hoạch / Đề cương chuyên môn <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="Ví dụ: Kế hoạch giảng dạy Tin học 11 - Học kỳ 2"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mục tiêu & Tóm tắt nội dung
            </label>
            <textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Tóm tắt yêu cầu cần đạt, thiết bị cần dùng và thời lượng thực hiện..."
              rows={3}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-sky-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cấp học
              </label>
              <select
                value={uploadForm.grade_level}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, grade_level: e.target.value as GradeLevel })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              >
                {Object.entries(GRADE_LEVEL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bộ môn
              </label>
              <select
                value={uploadForm.subject_type}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, subject_type: e.target.value as SubjectType })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              >
                {Object.entries(SUBJECT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tệp tài liệu đính kèm <span className="text-rose-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-lg p-5 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/20 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2 text-sky-700">
                  <FileText className="w-5 h-5" />
                  <span className="text-xs font-semibold">{selectedFile.name}</span>
                  <span className="text-[11px] text-slate-400">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 mt-1.5 font-medium">
                    Nhấp để duyệt tệp từ máy tính hoặc kéo thả vào đây
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hỗ trợ định dạng PDF, Word, Excel, PowerPoint (tối đa 20MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowUpload(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={uploading || !selectedFile || !uploadForm.title}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#091e42] hover:bg-sky-900 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-all"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploading ? 'Đang gửi...' : 'Nộp kế hoạch'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
