'use client'

import { Bell, Search, CalendarDays, Database, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Header() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [dateStr, setDateStr] = useState('Hôm nay')

  useEffect(() => {
    const today = new Date()
    setDateStr(
      today.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }, [])

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 gap-4">
      {/* Left: Academic Calendar Context */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
          <CalendarDays className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="capitalize truncate">{dateStr}</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Hệ thống cơ sở Sky-Line Riverside & Central</span>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-md mx-auto">
        <div
          className={`relative flex items-center transition-all duration-150 ${
            searchFocused ? 'ring-2 ring-sky-500/20' : ''
          }`}
        >
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tra cứu giáo án, thiết bị lab, đề tài STEM..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 transition-colors"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right: Operational Status & Notifications */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
          <Database className="w-3 h-3 text-emerald-600" />
          <span>Supabase Active</span>
        </div>

        <button
          className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200"
          title="Thông báo bộ môn"
          aria-label="Thông báo bộ môn"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  )
}
