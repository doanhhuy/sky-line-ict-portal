import Link from 'next/link'
import {
  GraduationCap,
  Monitor,
  BookOpen,
  Trophy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Cpu,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Institutional Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#091e42] border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest text-sky-400 uppercase block">
                Sky-Line Education System
              </span>
              <span className="text-sm font-bold text-white block">
                Cổng Điều Hành Tổ Tin Học & STEM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Đăng nhập cán bộ
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Vào Bàn Điều Hành</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        {/* Academic Hero Banner */}
        <section className="bg-[#091e42] text-white pt-14 pb-20 px-6 border-b border-slate-800">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/80 text-xs font-medium text-sky-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Số hóa toàn diện công tác quản trị chuyên môn và thiết bị dạy học</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Trung tâm Điều hành Nghiệp vụ
              <br />
              <span className="text-sky-400">Tổ Tin học - Công nghệ - STEM</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Giải pháp phục vụ Trưởng tổ chuyên môn và Giáo viên tại Hệ thống Giáo dục Sky-Line: Phê duyệt kế hoạch bài dạy, điều phối phòng máy tính thực hành và đồng hành cùng các đội tuyển khoa học kỹ thuật.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <span>Truy cập Bàn Điều Hành</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-sky-300" />
                <span>Đăng nhập Giáo viên / Tổ trưởng</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Pillars Showcase */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Khung Năng Lực Điều Hành
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              3 Trụ Cột Quản Trị Chuyên Môn Tại Sky-Line
            </h2>
            <p className="text-xs text-slate-500">
              Đồng bộ dữ liệu thời gian thực giữa Ban Giám Hiệu, Tổ trưởng và Giáo viên đứng lớp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Quản lý Chuyên môn & Tài nguyên
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lưu trữ phân phối chương trình, giáo án số hóa GDPT 2018 theo cấp Tiểu học, THCS và THPT. Hệ thống hỗ trợ Trưởng bộ môn ký duyệt trực tuyến nhanh chóng.
                </p>
              </div>

              <Link
                href="/dashboard/professional"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 pt-3 border-t border-slate-100"
              >
                <span>Xem kho hồ sơ chuyên môn</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Phòng Lab & Thiết bị Thực hành
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sơ đồ trạm máy tính PC, bộ kít WhalesBot Robotics, Drone và kính thực tế ảo VR. Đăng ký mượn phòng học tránh xung đột thời gian và báo cáo sự cố phần cứng tức thì.
                </p>
              </div>

              <Link
                href="/dashboard/equipment"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-3 border-t border-slate-100"
              >
                <span>Xem lịch phòng Lab & thiết bị</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Dự án STEM & Đội tuyển WRO
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bảng tiến trình cột mốc nghiên cứu cho các đề tài sáng chế tham gia Hội thi Tin học trẻ, Robothon, Cuộc thi KHKT và FIRST Tech Challenge.
                </p>
              </div>

              <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 pt-3 border-t border-slate-100"
              >
                <span>Xem đường đua đề tài STEM</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Academic Metric Bar */}
          <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-100">
              <div className="space-y-1">
                <div className="text-2xl lg:text-3xl font-bold font-mono text-slate-900">24+</div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Giáo viên cơ hữu</div>
              </div>
              <div className="space-y-1 pl-4">
                <div className="text-2xl lg:text-3xl font-bold font-mono text-emerald-700">156+</div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Thiết bị Lab & Robotics</div>
              </div>
              <div className="space-y-1 pl-4">
                <div className="text-2xl lg:text-3xl font-bold font-mono text-sky-700">100%</div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Giáo án số hóa</div>
              </div>
              <div className="space-y-1 pl-4">
                <div className="text-2xl lg:text-3xl font-bold font-mono text-purple-700">12+</div>
                <div className="text-[11px] text-slate-500 font-semibold uppercase">Đề tài thi đấu quốc gia</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#051329] text-slate-400 py-8 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span>Hệ thống Giáo dục Sky-Line · Tổ Tin học, Công nghệ & STEM</span>
          </div>
          <div>
            Đà Nẵng & Quảng Nam, Việt Nam · Bản quyền 2024
          </div>
        </div>
      </footer>
    </div>
  )
}
