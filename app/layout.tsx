import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sky-Line ICT Portal | Hệ thống Quản lý Bộ môn Tin học & STEM",
  description:
    "Cổng thông tin chuyên môn, quản lý thiết bị phòng Lab, robot giáo dục WhalesBot và các dự án STEM dành cho Trưởng Bộ môn CNTT — Sky-Line Education System, Việt Nam.",
  keywords: [
    "Sky-Line Education System",
    "ICT Portal",
    "Quản lý Tin học",
    "STEM Robotics",
    "WhalesBot",
    "Phòng Lab CNTT",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">{children}</body>
    </html>
  );
}
