'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import {
  Monitor,
  Calendar,
  AlertTriangle,
  Plus,
  Loader2,
  Search,
  Bot,
  Glasses,
  Cpu,
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Wrench,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import {
  type Equipment,
  type EquipmentBooking,
  type EquipmentStatus,
  type EquipmentCategory,
  EQUIPMENT_STATUS_LABELS,
  EQUIPMENT_CATEGORY_LABELS,
} from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'

const DEMO_EQUIPMENT: Equipment[] = [
  { id: '1', name: 'Trạm máy Lab A1 - PC 01', category: 'pc', status: 'available', location: 'Phòng Lab A1', serial_number: 'PC-A1-01', created_at: '' },
  { id: '2', name: 'Trạm máy Lab A1 - PC 02', category: 'pc', status: 'available', location: 'Phòng Lab A1', serial_number: 'PC-A1-02', created_at: '' },
  { id: '3', name: 'Trạm máy Lab A1 - PC 03', category: 'pc', status: 'in_use', location: 'Phòng Lab A1', serial_number: 'PC-A1-03', created_at: '' },
  { id: '4', name: 'Trạm máy Lab A1 - PC 04', category: 'pc', status: 'maintenance', location: 'Phòng Lab A1', serial_number: 'PC-A1-04', created_at: '' },
  { id: '5', name: 'Trạm máy Lab A1 - PC 05', category: 'pc', status: 'available', location: 'Phòng Lab A1', serial_number: 'PC-A1-05', created_at: '' },
  { id: '6', name: 'Trạm máy Lab A1 - PC 06', category: 'pc', status: 'broken', location: 'Phòng Lab A1', serial_number: 'PC-A1-06', created_at: '' },
  { id: '7', name: 'Trạm máy Lab B2 - PC 01', category: 'pc', status: 'available', location: 'Phòng Lab B2', serial_number: 'PC-B2-01', created_at: '' },
  { id: '8', name: 'Trạm máy Lab B2 - PC 02', category: 'pc', status: 'in_use', location: 'Phòng Lab B2', serial_number: 'PC-B2-02', created_at: '' },
  { id: '9', name: 'Kit WhalesBot Robotics - Bộ 01', category: 'robotics_kit', status: 'available', location: 'Tủ STEM B1', serial_number: 'WB-01', created_at: '' },
  { id: '10', name: 'Kit WhalesBot Robotics - Bộ 02', category: 'robotics_kit', status: 'available', location: 'Tủ STEM B1', serial_number: 'WB-02', created_at: '' },
  { id: '11', name: 'Kit WhalesBot Robotics - Bộ 03', category: 'robotics_kit', status: 'in_use', location: 'Phòng Lab STEM', serial_number: 'WB-03', created_at: '' },
  { id: '12', name: 'Kit WhalesBot Robotics - Bộ 04', category: 'robotics_kit', status: 'maintenance', location: 'Tủ STEM B1', serial_number: 'WB-04', created_at: '' },
  { id: '13', name: 'Kính thực tế ảo Meta Quest 3 - #01', category: 'other', status: 'available', location: 'Phòng Thực nghiệm VR', serial_number: 'VR-01', created_at: '' },
  { id: '14', name: 'Kính thực tế ảo Meta Quest 3 - #02', category: 'other', status: 'available', location: 'Phòng Thực nghiệm VR', serial_number: 'VR-02', created_at: '' },
  { id: '15', name: 'Flycam DJI Tello Edu STEM - #01', category: 'drone', status: 'available', location: 'Kho Thiết bị STEM', serial_number: 'DR-01', created_at: '' },
  { id: '16', name: 'Flycam DJI Tello Edu STEM - #02', category: 'drone', status: 'broken', location: 'Kho Thiết bị STEM', serial_number: 'DR-02', created_at: '' },
]

const DEMO_BOOKINGS: EquipmentBooking[] = [
  {
    id: '1',
    equipment_id: '1',
    equipment_name: 'Phòng Lab Tin học A1 (32 Máy tính)',
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
    equipment_id: '9',
    equipment_name: 'Bộ Kit WhalesBot Robotics (20 bộ)',
    booked_by: 'user2',
    booker_name: 'Lê Văn C',
    date: '2024-10-16',
    start_time: '14:00',
    end_time: '16:00',
    purpose: 'Bồi dưỡng Đội tuyển Robothon WRO',
    status: 'pending',
    created_at: '2024-10-15T14:00:00Z',
  },
  {
    id: '3',
    equipment_id: '13',
    equipment_name: 'Kính VR Meta Quest 3 (4 bộ)',
    booked_by: 'user4',
    booker_name: 'Phạm Thị D',
    date: '2024-10-17',
    start_time: '09:45',
    end_time: '11:15',
    purpose: 'Bài học Trải nghiệm Sinh học 11',
    status: 'confirmed',
    created_at: '2024-10-15T16:00:00Z',
  },
]

interface IncidentItem {
  id: string
  equipment_name: string
  location: string
  reporter: string
  severity: 'low' | 'medium' | 'high'
  title: string
  date: string
  status: 'pending' | 'resolved'
}

const DEMO_INCIDENTS: IncidentItem[] = [
  {
    id: 'inc-1',
    equipment_name: 'Trạm máy Lab A1 - PC 06',
    location: 'Phòng Lab A1',
    reporter: 'Trần Thị B',
    severity: 'medium',
    title: 'Nguồn máy tính không khởi động, quạt kêu to',
    date: '2024-10-15',
    status: 'pending',
  },
  {
    id: 'inc-2',
    equipment_name: 'Flycam DJI Tello Edu STEM - #02',
    location: 'Kho Thiết bị STEM',
    reporter: 'Lê Văn C',
    severity: 'high',
    title: 'Gãy cánh quạt motor số 3 khi thử nghiệm ngoài sân',
    date: '2024-10-14',
    status: 'pending',
  },
]

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(DEMO_EQUIPMENT)
  const [bookings, setBookings] = useState<EquipmentBooking[]>(DEMO_BOOKINGS)
  const [incidents, setIncidents] = useState<IncidentItem[]>(DEMO_INCIDENTS)
  const [activeTab, setActiveTab] = useState<'grid' | 'bookings' | 'incidents'>('grid')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showBooking, setShowBooking] = useState(false)
  const [showIncident, setShowIncident] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Equipment | null>(null)

  const [bookingForm, setBookingForm] = useState({
    equipment_id: '',
    date: '',
    start_time: '08:00',
    end_time: '09:30',
    purpose: '',
  })

  const [incidentForm, setIncidentForm] = useState({
    equipment_id: '',
    title: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    description: '',
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const { data: eqData } = await supabase.from('equipments').select('*')
        if (eqData && eqData.length > 0) {
          setEquipment(eqData)
        }
        const { data: bkData } = await supabase.from('equipment_bookings').select('*')
        if (bkData && bkData.length > 0) {
          setBookings(bkData)
        }
      } catch {}
      setBookingForm((prev) => ({ ...prev, date: prev.date || new Date().toISOString().split('T')[0] }))
    }
    loadData()
  }, [])

  const filteredEquipment =
    categoryFilter === 'all'
      ? equipment
      : equipment.filter((e) => e.category === categoryFilter)

  const stats = {
    total: equipment.length,
    available: equipment.filter((e) => e.status === 'available').length,
    inUse: equipment.filter((e) => e.status === 'in_use').length,
    maintenance: equipment.filter((e) => e.status === 'maintenance').length,
    broken: equipment.filter((e) => e.status === 'broken').length,
  }

  function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!bookingForm.equipment_id || !bookingForm.purpose) return

    const selectedEq = equipment.find((e) => e.id === bookingForm.equipment_id)
    const newBooking: EquipmentBooking = {
      id: `bk-${Date.now()}`,
      equipment_id: bookingForm.equipment_id,
      equipment_name: selectedEq?.name || 'Phòng Lab',
      booked_by: 'current_user',
      booker_name: 'Trần Thị B',
      date: bookingForm.date,
      start_time: bookingForm.start_time,
      end_time: bookingForm.end_time,
      purpose: bookingForm.purpose,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    setBookings([newBooking, ...bookings])
    setShowBooking(false)
    setBookingForm({
      equipment_id: '',
      date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      end_time: '09:30',
      purpose: '',
    })
  }

  function handleIncidentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!incidentForm.equipment_id || !incidentForm.title) return

    const targetEq = equipment.find((e) => e.id === incidentForm.equipment_id)
    const newInc: IncidentItem = {
      id: `inc-${Date.now()}`,
      equipment_name: targetEq?.name || 'Thiết bị',
      location: targetEq?.location || 'Phòng Lab',
      reporter: 'Trần Thị B',
      severity: incidentForm.severity,
      title: incidentForm.title,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    }

    setIncidents([newInc, ...incidents])
    setShowIncident(false)
    setIncidentForm({ equipment_id: '', title: '', severity: 'medium', description: '' })
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Title & Operational Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Phòng Lab & Cơ Sở Vật Chất Công Nghệ
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {stats.available}/{stats.total} Sẵn sàng
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối phòng máy tính, robot giáo dục WhalesBot, thiết bị VR và máy in 3D
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBooking(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#091e42] hover:bg-sky-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Đăng ký ca máy</span>
          </button>
          <button
            onClick={() => setShowIncident(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Báo cáo sự cố</span>
          </button>
        </div>
      </div>

      {/* Hardware Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Tổng thiết bị</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{stats.total}</span>
        </div>
        <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
          <span className="text-[11px] text-emerald-700 font-semibold block uppercase">Sẵn sàng</span>
          <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">{stats.available}</span>
        </div>
        <div className="p-3.5 rounded-lg border border-sky-200 bg-sky-50/50">
          <span className="text-[11px] text-sky-700 font-semibold block uppercase">Đang lên lớp</span>
          <span className="text-xl font-bold font-mono text-sky-800 mt-1 block">{stats.inUse}</span>
        </div>
        <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50">
          <span className="text-[11px] text-amber-700 font-semibold block uppercase">Bảo trì định kỳ</span>
          <span className="text-xl font-bold font-mono text-amber-800 mt-1 block">{stats.maintenance}</span>
        </div>
        <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/50">
          <span className="text-[11px] text-rose-700 font-semibold block uppercase">Hỏng hóc</span>
          <span className="text-xl font-bold font-mono text-rose-800 mt-1 block">{stats.broken}</span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('grid')}
          className={cn(
            'pb-2.5 transition-colors border-b-2 -mb-[2px] flex items-center gap-1.5',
            activeTab === 'grid'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Monitor className="w-4 h-4" />
          <span>Sơ đồ trạm máy & thiết bị</span>
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={cn(
            'pb-2.5 transition-colors border-b-2 -mb-[2px] flex items-center gap-1.5',
            activeTab === 'bookings'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <Calendar className="w-4 h-4" />
          <span>Lịch đặt ca thực hành ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={cn(
            'pb-2.5 transition-colors border-b-2 -mb-[2px] flex items-center gap-1.5',
            activeTab === 'incidents'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Nhật ký sự cố kỹ thuật ({incidents.length})</span>
        </button>
      </div>

      {/* TAB 1: Hardware Grid View */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Loại thiết bị:</span>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'pc', label: 'Máy tính PC Lab' },
              { key: 'robotics_kit', label: 'WhalesBot Robotics' },
              { key: 'drone', label: 'Drone & Flycam' },
              { key: 'other', label: 'VR & Thiết bị khác' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0',
                  categoryFilter === cat.key
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredEquipment.map((eq) => {
              const isAvail = eq.status === 'available'
              const isInUse = eq.status === 'in_use'
              const isMaint = eq.status === 'maintenance'
              const isBroken = eq.status === 'broken'

              return (
                <div
                  key={eq.id}
                  onClick={() => setSelectedStation(eq)}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {eq.serial_number || 'EQ-CODE'}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                        {eq.name}
                      </h3>
                    </div>

                    <span
                      className={
                        isAvail
                          ? 'status-dot status-dot-active'
                          : isInUse
                          ? 'status-dot status-dot-pending'
                          : 'status-dot status-dot-incident'
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="truncate">{eq.location}</span>
                    <span
                      className={cn(
                        'font-semibold',
                        isAvail ? 'text-emerald-700' : isInUse ? 'text-sky-700' : isMaint ? 'text-amber-700' : 'text-rose-700'
                      )}
                    >
                      {EQUIPMENT_STATUS_LABELS[eq.status]}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Bookings Timetable */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                <th className="px-5 py-3">Phòng máy / Thiết bị</th>
                <th className="px-4 py-3">Giáo viên phụ trách</th>
                <th className="px-4 py-3">Ngày sử dụng</th>
                <th className="px-4 py-3">Khung giờ</th>
                <th className="px-4 py-3">Nội dung / Mục đích</th>
                <th className="px-5 py-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="table-row-hover">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {b.equipment_name}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{b.booker_name}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                    {b.date ? formatDate(b.date) : '—'}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] border border-slate-200">
                      {b.start_time} - {b.end_time}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 max-w-[240px] truncate">
                    {b.purpose}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'}>
                      {b.status === 'confirmed' ? 'Đã xếp lịch' : 'Chờ xác nhận'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Incidents Log */}
      {activeTab === 'incidents' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Danh sách thiết bị cần can thiệp kỹ thuật ({incidents.length})
            </span>
            <button
              onClick={() => setShowIncident(true)}
              className="px-3 py-1.5 bg-[#091e42] text-white rounded text-xs font-semibold hover:bg-sky-900"
            >
              + Báo hỏng máy
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{inc.equipment_name}</span>
                    <span className="text-[11px] text-slate-400">({inc.location})</span>
                    <Badge variant={inc.severity === 'high' ? 'danger' : 'warning'}>
                      {inc.severity === 'high' ? 'Khẩn cấp' : 'Bình thường'}
                    </Badge>
                  </div>
                  <p className="text-slate-700 text-xs">{inc.title}</p>
                  <p className="text-[11px] text-slate-400">
                    Báo cáo bởi {inc.reporter} · Ngày {inc.date}
                  </p>
                </div>

                <button
                  onClick={() => alert(`Đã chuyển thông báo xử lý cho kỹ thuật viên IT về ${inc.equipment_name}`)}
                  className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 shrink-0"
                >
                  Điều phối kỹ thuật
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <Modal open={showBooking} onClose={() => setShowBooking(false)} title="Đăng ký sử dụng Phòng Lab / Bộ kít thực hành" size="md">
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chọn phòng máy hoặc thiết bị <span className="text-rose-500">*</span>
            </label>
            <select
              value={bookingForm.equipment_id}
              onChange={(e) => setBookingForm({ ...bookingForm, equipment_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              required
            >
              <option value="">-- Nhấp chọn thiết bị khả dụng --</option>
              {equipment
                .filter((e) => e.status === 'available')
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.location})
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày dạy</label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Từ giờ</label>
              <input
                type="time"
                value={bookingForm.start_time}
                onChange={(e) => setBookingForm({ ...bookingForm, start_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Đến giờ</label>
              <input
                type="time"
                value={bookingForm.end_time}
                onChange={(e) => setBookingForm({ ...bookingForm, end_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mục đích tiết dạy / Lớp phụ trách <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={bookingForm.purpose}
              onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
              placeholder="Ví dụ: Tiết thực hành Lập trình C++ lớp 11/1"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowBooking(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#091e42] hover:bg-sky-900 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Xác nhận gửi yêu cầu
            </button>
          </div>
        </form>
      </Modal>

      {/* Incident Modal */}
      <Modal open={showIncident} onClose={() => setShowIncident(false)} title="Ghi nhận hỏng hóc & Sự cố kỹ thuật" size="md">
        <form onSubmit={handleIncidentSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thiết bị gặp sự cố <span className="text-rose-500">*</span>
            </label>
            <select
              value={incidentForm.equipment_id}
              onChange={(e) => setIncidentForm({ ...incidentForm, equipment_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              required
            >
              <option value="">-- Chọn máy tính hoặc thiết bị --</option>
              {equipment.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mức độ ảnh hưởng
            </label>
            <select
              value={incidentForm.severity}
              onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="low">Nhẹ (Máy vẫn chạy được)</option>
              <option value="medium">Trung bình (Không thao tác được, cần kiểm tra)</option>
              <option value="high">Nghiêm trọng (Hỏng phần cứng, mất an toàn điện)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả hiện tượng sự cố <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={incidentForm.title}
              onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
              placeholder="Ví dụ: Màn hình không lên tín hiệu, bàn phím bị liệt phím Enter..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500 resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowIncident(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Gửi thông báo kỹ thuật
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
