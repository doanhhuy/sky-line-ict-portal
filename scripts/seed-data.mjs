import { createClient } from '@supabase/supabase-js'

// Chạy: node --env-file=.env.local scripts/seed-data.mjs
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY. Hãy chạy với --env-file=.env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seed() {
  console.log('--- BẮT ĐẦU ĐẨY DỮ LIỆU DEMO LÊN SUPABASE ---')

  // 1. SEED TEACHERS
  console.log('\n[1/7] Đang nạp dữ liệu giáo viên (teachers)...')
  const teacherList = [
    { email: 'tranthib@skyline.edu.vn', name: 'Trần Thị B', phone: '0905234567', role: 'teacher' },
    { email: 'levanc@skyline.edu.vn', name: 'Lê Văn C', phone: '0905345678', role: 'teacher' },
    { email: 'phamthid@skyline.edu.vn', name: 'Phạm Thị D', phone: '0905456789', role: 'teacher' },
    { email: 'hoangminhe@skyline.edu.vn', name: 'Hoàng Minh E', phone: '0905567890', role: 'teacher' },
    { email: 'vuthif@skyline.edu.vn', name: 'Vũ Thị F', phone: '0905678901', role: 'teacher' },
  ]

  const insertedTeachers = []
  // Admin already exists in teachers
  const { data: existingAdmin } = await supabase.from('teachers').select('*').eq('email', 'admin@skyline.edu.vn').single()
  if (existingAdmin) {
    insertedTeachers.push(existingAdmin)
  }

  for (const t of teacherList) {
    try {
      // Create user in auth if not exist
      const { data: authData } = await supabase.auth.signUp({
        email: t.email,
        password: 'Password123!',
      })

      const userId = authData?.user?.id
      if (userId) {
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .upsert({
            id: userId,
            full_name: t.name,
            email: t.email,
            role: t.role,
            phone: t.phone,
          })
          .select()
          .single()

        if (teacherData) {
          insertedTeachers.push(teacherData)
          console.log(`  ✓ Đã nạp giáo viên: ${t.name} (${t.email})`)
        } else if (teacherError) {
          console.log(`  - Giáo viên ${t.name}:`, teacherError.message)
        }
      }
    } catch (e) {
      console.log(`  - Lỗi nạp giáo viên ${t.name}:`, e.message)
    }
  }

  // 2. SEED EQUIPMENTS
  console.log('\n[2/7] Đang nạp danh mục thiết bị (equipments)...')
  const equipmentData = [
    { code: 'PC-A1-01', name: 'Lab A1 - PC 01 (Core i7 / 16GB)', category: 'pc', status: 'available', location: 'Phòng Lab A1', notes: 'Máy bàn chuyên dụng cho đồ họa & AI' },
    { code: 'PC-A1-02', name: 'Lab A1 - PC 02 (Core i7 / 16GB)', category: 'pc', status: 'available', location: 'Phòng Lab A1', notes: 'Máy bàn thực hành' },
    { code: 'PC-A1-03', name: 'Lab A1 - PC 03 (Core i7 / 16GB)', category: 'pc', status: 'in_use', location: 'Phòng Lab A1', notes: 'Đang phục vụ lớp 10A1' },
    { code: 'PC-A1-04', name: 'Lab A1 - PC 04 (Core i7 / 16GB)', category: 'pc', status: 'maintenance', location: 'Phòng Lab A1', notes: 'Cần bảo trì cập nhật Windows' },
    { code: 'PC-A1-05', name: 'Lab A1 - PC 05 (Core i7 / 16GB)', category: 'pc', status: 'available', location: 'Phòng Lab A1', notes: 'Máy bàn thực hành' },
    { code: 'PC-A1-06', name: 'Lab A1 - PC 06 (Core i7 / 16GB)', category: 'pc', status: 'broken', location: 'Phòng Lab A1', notes: 'Lỗi nguồn màn hình' },
    { code: 'PC-B2-01', name: 'Lab B2 - PC 01 (Core i5 / 16GB)', category: 'pc', status: 'available', location: 'Phòng Lab B2', notes: 'Máy bàn lớp Tin học THCS' },
    { code: 'PC-B2-02', name: 'Lab B2 - PC 02 (Core i5 / 16GB)', category: 'pc', status: 'in_use', location: 'Phòng Lab B2', notes: 'Đang phục vụ lớp 7A2' },
    { code: 'WB-SMART-01', name: 'Bộ WhalesBot Smart A1 - #01', category: 'robotics_kit', status: 'available', location: 'Tủ lưu trữ STEM Tầng 2', notes: 'Đầy đủ cảm biến và động cơ' },
    { code: 'WB-SMART-02', name: 'Bộ WhalesBot Smart A1 - #02', category: 'robotics_kit', status: 'available', location: 'Tủ lưu trữ STEM Tầng 2', notes: 'Đầy đủ 120 chi tiết lắp ráp' },
    { code: 'WB-SMART-03', name: 'Bộ WhalesBot Smart A1 - #03', category: 'robotics_kit', status: 'in_use', location: 'Phòng STEM Robotics', notes: 'CLB Robotics đang tập luyện WRO' },
    { code: 'WB-SMART-04', name: 'Bộ WhalesBot Smart A1 - #04', category: 'robotics_kit', status: 'maintenance', location: 'Phòng Kỹ thuật', notes: 'Kiểm tra module bluetooth' },
    { code: 'WB-SWARM-01', name: 'Bộ WhalesBot Swarm Đa năng', category: 'robotics_kit', status: 'available', location: 'Tủ STEM Tầng 2', notes: 'Bộ kit nâng cao cho THPT' },
    { code: 'DRONE-STEM-01', name: 'Drone Mini Giáo dục Sky-Line #01', category: 'drone', status: 'available', location: 'Phòng Sáng tạo STEM', notes: 'Bộ kit Drone lập trình bay tự động' },
    { code: 'DRONE-STEM-02', name: 'Drone Mini Giáo dục Sky-Line #02', category: 'drone', status: 'available', location: 'Phòng Sáng tạo STEM', notes: 'Bộ kit Drone lập trình bay tự động' },
    { code: 'VR-QUEST-01', name: 'Kính VR Meta Quest 3 - #01', category: 'other', status: 'available', location: 'Phòng KHTN 3D', notes: 'Kính thực tế ảo bài học khoa học' },
    { code: 'VR-QUEST-02', name: 'Kính VR Meta Quest 3 - #02', category: 'other', status: 'available', location: 'Phòng KHTN 3D', notes: 'Kính thực tế ảo bài học sinh học' },
    { code: 'VR-QUEST-03', name: 'Kính VR Meta Quest 3 - #03', category: 'other', status: 'broken', location: 'Phòng Kỹ thuật', notes: 'Nứt thấu kính cần thay thế' },
  ]

  const insertedEquipments = []
  for (const eq of equipmentData) {
    const { data, error } = await supabase
      .from('equipments')
      .upsert(eq, { onConflict: 'code' })
      .select()
      .single()

    if (data) {
      insertedEquipments.push(data)
      console.log(`  ✓ Đã nạp thiết bị: ${eq.name} (${eq.code})`)
    } else if (error) {
      console.log(`  - Thiết bị ${eq.code}:`, error.message)
    }
  }

  // 3. SEED DIGITAL RESOURCES (Kho học liệu số)
  console.log('\n[3/7] Đang nạp kho học liệu số (digital_resources)...')
  const resources = [
    {
      title: 'Giáo án Tin học 10 - Lập trình Python căn bản',
      description: 'Chương trình 18 tuần nhập môn Python cho học sinh lớp 10 THPT Sky-Line',
      grade_level: 'thpt',
      subject_type: 'tin_hoc',
      file_url: 'https://skyline.edu.vn/materials/Tin10_Python.pdf',
    },
    {
      title: 'Giáo trình STEM Robotics WhalesBot Lớp 7',
      description: 'Chuyên đề điều khiển robot vượt sa bàn và phân loại vật thể',
      grade_level: 'thcs',
      subject_type: 'stem_robotics',
      file_url: 'https://skyline.edu.vn/materials/Robotics_WhalesBot_L7.docx',
    },
    {
      title: 'Chương trình Nhập môn Trí tuệ Nhân tạo Tiểu học',
      description: 'Hoạt động trải nghiệm nhận diện hình ảnh và trò chơi AI tương tác',
      grade_level: 'tieu_hoc',
      subject_type: 'ai',
      file_url: 'https://skyline.edu.vn/materials/AI_TieuHoc_SkyLine.pdf',
    },
    {
      title: 'Đề cương Robotics Nâng cao Lớp 9 - Tuyển WRO',
      description: 'Chuyên đề giải thuật PID dò đường và cảm biến hồi tiếp',
      grade_level: 'thcs',
      subject_type: 'stem_robotics',
      file_url: 'https://skyline.edu.vn/materials/WRO_Robotics_Advanced_L9.pdf',
    },
    {
      title: 'Tài liệu Thực hành KHTN 3D trên kính VR',
      description: 'Hướng dẫn sử dụng phòng Lab thực tế ảo mô phỏng hệ mặt trời',
      grade_level: 'thpt',
      subject_type: 'tin_hoc',
      file_url: 'https://skyline.edu.vn/materials/HuongDan_VRLab_KHTN.pdf',
    },
  ]

  for (const r of resources) {
    const { data, error } = await supabase.from('digital_resources').insert(r).select().single()
    if (data) {
      console.log(`  ✓ Đã nạp học liệu: ${r.title}`)
    } else if (error) {
      console.log(`  - Học liệu ${r.title}:`, error.message)
    }
  }

  // 4. SEED PROFESSIONAL PLANS (Kế hoạch chuyên môn)
  console.log('\n[4/7] Đang nạp kế hoạch chuyên môn (professional_plans)...')
  const plans = [
    {
      title: 'Phân phối chương trình Tin học 10 - Năm học 2024-2025',
      category: 'phan_phoi_chuong_trinh',
      status: 'approved',
      file_url: 'https://skyline.edu.vn/plans/PPCT_Tin10_2024.pdf',
    },
    {
      title: 'Kế hoạch dạy học Tuần 8 - Khối THCS',
      category: 'ke_hoach_tuan',
      status: 'approved',
      file_url: 'https://skyline.edu.vn/plans/KH_Tuan8_THCS.xlsx',
    },
    {
      title: 'Kế hoạch dạy học Tuần 9 - Toàn hệ thống',
      category: 'ke_hoach_tuan',
      status: 'pending',
      file_url: 'https://skyline.edu.vn/plans/KH_Tuan9_All.xlsx',
    },
    {
      title: 'Chuyên đề: Ứng dụng AI và Computer Vision trong Giảng dạy STEM',
      category: 'chuyen_de',
      status: 'approved',
      file_url: 'https://skyline.edu.vn/plans/ChuyenDe_AI_STEM_2024.pdf',
    },
  ]

  for (const p of plans) {
    const { data, error } = await supabase.from('professional_plans').insert(p).select().single()
    if (data) {
      console.log(`  ✓ Đã nạp kế hoạch: ${p.title}`)
    } else if (error) {
      console.log(`  - Kế hoạch ${p.title}:`, error.message)
    }
  }

  // 5. SEED STEM PROJECTS (Cuộc thi & Dự án STEM)
  console.log('\n[5/7] Đang nạp dự án STEM (stem_projects)...')
  const stemList = [
    {
      project_name: 'Robot cứu hộ thông minh Sky-Bot',
      competition_name: 'WRO 2024 Vietnam',
      status: 'planning',
    },
    {
      project_name: 'Hệ thống AI phân loại rác thải tự động',
      competition_name: 'Google Science Fair 2024',
      status: 'planning',
    },
    {
      project_name: 'Hệ thống tưới cây thông minh IoT tại Sky-Line Garden',
      competition_name: 'STEM Day Đà Nẵng 2024',
      status: 'completed',
    },
    {
      project_name: 'Drone giao hàng mini tự hành',
      competition_name: 'FIRST Tech Challenge 2024',
      status: 'planning',
    },
    {
      project_name: 'Xe mô hình năng lượng mặt trời',
      competition_name: 'Solar Car Challenge 2024',
      status: 'completed',
    },
  ]

  for (const sp of stemList) {
    const { data, error } = await supabase.from('stem_projects').insert(sp).select().single()
    if (data) {
      console.log(`  ✓ Đã nạp dự án: ${sp.project_name}`)
    } else if (error) {
      console.log(`  - Dự án ${sp.project_name}:`, error.message)
    }
  }

  // 6. SEED EQUIPMENT BOOKINGS
  console.log('\n[6/7] Đang nạp lịch đặt phòng Lab (equipment_bookings)...')
  const firstEquip = insertedEquipments[0]
  const secondEquip = insertedEquipments[8]
  const firstTeacher = insertedTeachers[0]

  const bookings = [
    {
      equipment_id: firstEquip?.id,
      teacher_id: firstTeacher?.id,
      purpose: 'Thực hành Lập trình Tin học Lớp 10A1',
      start_time: '2026-10-16T08:00:00Z',
      end_time: '2026-10-16T09:30:00Z',
      status: 'confirmed',
    },
    {
      equipment_id: secondEquip?.id,
      teacher_id: firstTeacher?.id,
      purpose: 'CLB Robotics WhalesBot tập luyện WRO',
      start_time: '2026-10-16T14:00:00Z',
      end_time: '2026-10-16T15:30:00Z',
      status: 'pending',
    },
  ]

  for (const b of bookings) {
    const { data, error } = await supabase.from('equipment_bookings').insert(b).select().single()
    if (data) {
      console.log(`  ✓ Đã nạp lịch đặt: ${b.purpose}`)
    } else if (error) {
      console.log(`  - Lịch đặt:`, error.message)
    }
  }

  // 7. SEED EQUIPMENT INCIDENTS
  console.log('\n[7/7] Đang nạp báo cáo sự cố (equipment_incidents)...')
  const incidents = [
    {
      equipment_id: firstEquip?.id,
      reported_by: firstTeacher?.id,
      issue_description: 'PC 06 Phòng Lab A1 không lên nguồn, quạt case phát tiếng kêu lạ',
      image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop',
      status: 'open',
    },
    {
      equipment_id: secondEquip?.id,
      reported_by: firstTeacher?.id,
      issue_description: 'Bộ WhalesBot Smart A1 #04 bị lỏng cổng sạc pin micro-USB',
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop',
      status: 'in_progress',
    },
  ]

  for (const inc of incidents) {
    const { data, error } = await supabase.from('equipment_incidents').insert(inc).select().single()
    if (data) {
      console.log(`  ✓ Đã nạp sự cố: ${inc.issue_description.slice(0, 40)}...`)
    } else if (error) {
      console.log(`  - Sự cố:`, error.message)
    }
  }

  console.log('\n=== HOÀN TẤT NẠP DỮ LIỆU LÊN SUPABASE THÀNH CÔNG 100%! ===')
}

seed().catch(console.error)
