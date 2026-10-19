'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import {
  LayoutDashboard,
  BookOpen,
  Monitor,
  Trophy,
  ChevronLeft,
  LogOut,
  GraduationCap,
  Sparkles,
  Shield,
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  {
    name: 'Tổng quan điều hành',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: 'Chính',
  },
  {
    name: 'Quản lý chuyên môn',
    href: '/dashboard/professional',
    icon: BookOpen,
    badge: 'Kế hoạch & Đề cương',
  },
  {
    name: 'Phòng Lab & Thiết bị',
    href: '/dashboard/equipment',
    icon: Monitor,
    badge: 'Lịch mượn & Sự cố',
  },
  {
    name: 'Dự án STEM & WRO',
    href: '/dashboard/projects',
    icon: Trophy,
    badge: 'Cuộc thi sáng chế',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const userAny = user as any
  const displayName = userAny?.user_metadata?.full_name || userAny?.full_name || (user?.email?.includes('admin') ? 'Trưởng Tổ Tin Học' : user?.email?.split('@')[0] || 'Cán bộ ICT')
  const userRole = userAny?.user_metadata?.role === 'admin' || userAny?.role === 'admin' ? 'Trưởng bộ môn' : 'Giáo viên bộ môn'

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen sky-sidebar transition-all duration-300 ease-in-out flex flex-col select-none',
        collapsed ? 'w-[72px]' : 'w-[270px]'
      )}
    >
      {/* Brand & Institution Header */}
      <div className="flex items-center gap-3 px-5 h-[76px] border-b border-white/10 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 border border-white/15">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm tracking-tight">Sky-Line Portal</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                ICT
              </span>
            </div>
            <p className="text-slate-400 text-[11px] truncate mt-0.5 font-medium">
              Tổ Tin học · Công nghệ · STEM
            </p>
          </div>
        )}
      </div>

      {/* Academic Term Capsule */}
      {!collapsed && (
        <div className="px-4 py-3 mx-3 my-2.5 rounded-lg bg-white/[0.04] border border-white/10">
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span>Năm học 2024 - 2025</span>
            <span className="text-amber-400 font-semibold">Tuần 18</span>
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full w-[65%]" />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-sky-500/20 text-white border border-sky-400/30 shadow-sm'
                  : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-sky-300' : 'text-slate-400 group-hover:text-slate-200'
                )}
              />
              {!collapsed && (
                <div className="flex-1 overflow-hidden">
                  <span className="block truncate">{item.name}</span>
                  {!isActive && (
                    <span className="text-[10px] text-slate-400 font-normal truncate block">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-sky-300 shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Section & Session status */}
      <div className="border-t border-white/10 p-3 shrink-0 bg-black/15">
        <div
          className={cn(
            'flex items-center gap-3 px-2.5 py-2 rounded-lg',
            collapsed ? 'justify-center' : ''
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-400/30 flex items-center justify-center shrink-0 text-white font-bold text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {displayName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-400 text-[10px] truncate">
                  {userRole}
                </span>
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute -right-3 top-[80px] w-6 h-6 rounded-full bg-[#091e42] border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-sky-900 transition-all z-50 shadow-md',
          collapsed && 'rotate-180'
        )}
        aria-label="Thu gọn hoặc mở rộng thanh menu"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
    </aside>
  )
}
