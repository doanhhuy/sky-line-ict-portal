# Sky-Line ICT Portal (Cổng Thông Tin Bộ Môn ICT & STEM)

> Hệ thống quản trị chuyên môn, thiết bị phòng Lab và dự án STEM dành riêng cho **Trưởng Bộ môn Công nghệ thông tin (Head of ICT Department)** tại **Hệ thống Giáo dục Sky-Line (Sky-Line Education System, Việt Nam)**.

---

## 🌟 Tổng Quan Tính Năng Chính

### 1. Xác thực & Dashboard Điều hành (Auth & Role-Based Dashboard)
- **Đăng nhập Supabase Auth**: Hỗ trợ đăng nhập tài khoản cán bộ/giáo viên với email & password, cùng chế độ Đăng nhập Trải nghiệm nhanh (Demo Mode).
- **Thống kê thời gian thực**: Tổng số giáo viên bộ môn, thiết bị hoạt động, hồ sơ chờ duyệt, dự án STEM đang triển khai.
- **Tiện ích tổng hợp**: Danh sách hồ sơ kế hoạch nộp mới nhất, lịch phòng Lab hôm nay và tiến độ dự án trọng điểm.

### 2. Phân Hệ 1: Quản Lý Chuyên Môn (Professional Management)
- **Kho học liệu số**: Quản lý và tra cứu kế hoạch giảng dạy, phân phối chương trình, thời khóa biểu và tài liệu chuyên môn.
- **Bộ lọc đa chiều**: Lọc nhanh theo cấp học (**Tiểu học, THCS, THPT**) và môn học (**Tin học, STEM Robotics, Trí tuệ nhân tạo - AI, Khác**).
- **Upload tích hợp Supabase Storage**: Tải lên tài liệu giáo án kèm thông tin năm học, học kỳ và trạng thái phê duyệt.

### 3. Phân Hệ 2: Quản Lý Thiết Bị & Phòng Lab (Lab & Equipment Management)
- **Bản đồ trạng thái trực quan (Status Grid)**: Theo dõi trực tiếp tình trạng từng máy tính (Lab A1, Lab B2), bộ kit robot giáo dục (**WhalesBot Smart A1, Swarm**), kính VR (**Meta Quest 3**) và máy chiếu.
- **Đặt lịch phòng Lab thông minh**: Modal đăng ký mượn thiết bị và phòng thực hành với **thuật toán kiểm tra xung đột thời gian (Conflict Detection)** tự động.
- **Báo cáo sự cố nhanh**: Biểu mẫu ghi nhận sự cố hỏng hóc, phân loại mức độ nghiêm trọng (Thấp, Trung bình, Cao, Nghiêm trọng) kèm tải ảnh minh chứng.

### 4. Phân Hệ 3: Quản Lý Cuộc Thi & Dự Án STEM (STEM Projects & Competitions)
- **Giao diện kép (Kanban Board & Data Table)**: Chuyển đổi linh hoạt giữa bảng Kanban theo các cột tiến độ (**Ý tưởng, Lên kế hoạch, Đang thực hiện, Đánh giá, Hoàn thành**) và bảng dữ liệu.
- **Quản lý đội thi**: Theo dõi chi tiết thành viên học sinh, giáo viên hướng dẫn (mentor), mốc thời gian (milestones checklist).
- **Kho liên kết kỹ thuật**: Lưu trữ trực tiếp đường dẫn GitHub Repository mã nguồn và liên kết bản vẽ kỹ thuật (CAD/Blueprint).

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend & Routing**: [Next.js 16 (App Router)](https://nextjs.org/) + TypeScript + React 19
- **Giao diện & Styling**: Tailwind CSS + Lucide React Icons + Glassmorphism UI
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Supabase Storage)

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
sky-line-ict-portal/
├── app/
│   ├── layout.tsx              # Root Layout, font Inter/Geist, meta SEO tiếng Việt
│   ├── page.tsx                # Trang chủ Landing Page giới thiệu Sky-Line ICT Portal
│   ├── globals.css             # Tailwind v4 theme, màu sắc thương hiệu Sky-Line
│   ├── login/
│   │   └── page.tsx            # Trang đăng nhập Supabase Auth & Demo Bypass
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout (Sidebar + Header + AuthProvider)
│       ├── page.tsx            # Tổng quan Dashboard thống kê
│       ├── professional/
│       │   └── page.tsx        # Phân hệ 1: Quản lý Chuyên môn & Tài liệu số
│       ├── equipment/
│       │   └── page.tsx        # Phân hệ 2: Quản lý Thiết bị, Đặt lịch & Sự cố
│       └── projects/
│           └── page.tsx        # Phân hệ 3: Quản lý Dự án STEM & Cuộc thi (Kanban)
├── components/
│   ├── layout/
│   │   ├── header.tsx          # Header thanh điều hướng, tìm kiếm, ngày tháng tiếng Việt
│   │   └── sidebar.tsx         # Sidebar thu phóng, avatar vai trò Trưởng bộ môn
│   ├── providers/
│   │   └── auth-provider.tsx   # Supabase Auth Context Provider
│   └── ui/
│       ├── badge.tsx           # Badge trạng thái màu sắc chuẩn
│       ├── modal.tsx           # Reusable Modal dialog
│       └── stat-card.tsx       # Thẻ chỉ số Dashboard với biểu đồ & trend
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase Client (@supabase/ssr)
│   │   ├── server.ts           # Server Supabase Client với cookie store
│   │   └── proxy.ts            # Proxy session handler
│   ├── types.ts                # TypeScript Data Interfaces & Constants
│   └── utils.ts                # Helper cn (clsx + tailwind-merge)
├── supabase/
│   └── schema.sql              # SQL Script khởi tạo bảng & RLS Policies trên PostgreSQL
├── .env.example                # File mẫu biến môi trường
└── .env.local                  # Biến môi trường Supabase thực tế
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt thư viện dependencies
```bash
npm install
```

### 2. Cấu hình biến môi trường
Sao chép `.env.example` thành `.env.local` và điền thông tin Supabase của bạn:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Thiết lập Cơ sở dữ liệu Supabase
1. Mở **Supabase Dashboard** -> vào mục **SQL Editor**.
2. Mở file [`supabase/schema.sql`](./supabase/schema.sql), sao chép toàn bộ nội dung và bấm **Run**.
3. Vào mục **Storage** -> Tạo 2 bucket công khai (Public Bucket):
   - `documents` (Lưu tài liệu giáo án, kế hoạch tuần)
   - `incidents` (Lưu ảnh chụp sự cố thiết bị)

### 4. Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt để trải nghiệm!

---

## 👨‍💻 Bản quyền & Vận hành
**Sky-Line Education System — Tổ Công Nghệ Thông Tin & STEM**  
Đà Nẵng & Quảng Nam, Việt Nam.
