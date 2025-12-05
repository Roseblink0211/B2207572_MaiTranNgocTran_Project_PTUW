// seedData.js
// Script seed dữ liệu demo cho hệ thống thư viện

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import các model
const Sach = require("./models/Sach");
const TacGia = require("./models/TacGia");
const NhaXuatBan = require("./models/NhaXuatBan");
const TheoDoiMuonSach = require("./models/TheoDoiMuonSach");
const DocGia = require("./models/DocGia");

// Đường dẫn MongoDB – dùng env nếu có, không thì dùng localhost
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/library-management";

async function run() {
  try {
    console.log("🚀 Kết nối MongoDB...");
    await mongoose.connect(MONGODB_URI);

    console.log("🧹 Xoá dữ liệu cũ...");
    await Promise.all([
      Sach.deleteMany({}),
      TacGia.deleteMany({}),
      NhaXuatBan.deleteMany({}),
      TheoDoiMuonSach.deleteMany({}),
      DocGia.deleteMany({}),
    ]);

    // ================== NXB ==================
    console.log("🏢 Tạo nhà xuất bản...");
    const nxbs = await NhaXuatBan.insertMany([
      {
        maNXB: "NXB01",
        tenNXB: "Nhà xuất bản Giáo Dục",
        diaChi: "TP. Cần Thơ",
      },
      {
        maNXB: "NXB02",
        tenNXB: "Nhà xuất bản Trẻ",
        diaChi: "TP. Hồ Chí Minh",
      },
      {
        maNXB: "NXB03",
        tenNXB: "NXB Khoa học Kỹ thuật",
        diaChi: "Hà Nội",
      },
      {
        maNXB: "NXB04",
        tenNXB: "NXB Thông tin & Truyền thông",
        diaChi: "Hà Nội",
      },
      {
        maNXB: "NXB05",
        tenNXB: "NXB Đại học Quốc gia",
        diaChi: "TP. HCM",
      },
    ]);

    // ================== Tác giả ==================
    console.log("✍️  Tạo tác giả...");
    const tgs = await TacGia.insertMany([
      {
        maTacGia: "TG01",
        tenTacGia: "Nguyễn Văn A",
        diaChi: "Hà Nội",
        soDienThoai: "0900000001",
      },
      {
        maTacGia: "TG02",
        tenTacGia: "Trần Thị B",
        diaChi: "Đà Nẵng",
        soDienThoai: "0900000002",
      },
      {
        maTacGia: "TG03",
        tenTacGia: "Lê Minh C",
        diaChi: "TP. HCM",
        soDienThoai: "0123456786",
      },
      {
        maTacGia: "TG04",
        tenTacGia: "Hoàng Thảo D",
        diaChi: "Hà Nội",
        soDienThoai: "0123456785",
      },
      {
        maTacGia: "TG05",
        tenTacGia: "Phạm Quốc E",
        diaChi: "Cần Thơ",
        soDienThoai: "0123456784",
      },
      {
        maTacGia: "TG06",
        tenTacGia: "Ngô Thị F",
        diaChi: "Huế",
        soDienThoai: "0123456783",
      },
      {
        maTacGia: "TG07",
        tenTacGia: "Võ Tấn G",
        diaChi: "Hà Nội",
        soDienThoai: "0123456782",
      },
      {
        maTacGia: "TG08",
        tenTacGia: "Đinh Nhật H",
        diaChi: "TP. HCM",
        soDienThoai: "0123456781",
      },
      {
        maTacGia: "TG09",
        tenTacGia: "Tống Ngọc I",
        diaChi: "Nha Trang",
        soDienThoai: "0123456780",
      },
      {
        maTacGia: "TG10",
        tenTacGia: "Đoàn Thanh K",
        diaChi: "Đà Lạt",
        soDienThoai: "0123456779",
      },
    ]);

    // ================== Sách ==================
    console.log("📚 Tạo sách...");
    const sachs = await Sach.insertMany([
      {
        maSach: "S001",
        tenSach: "Lập trình Java cơ bản",
        donGia: 120000,
        soQuyen: 10,
        namXuatBan: 2024,
        maNXB: nxbs[0]._id,
        nguonGoc: "Mua mới",
        maTacGia: tgs[0]._id,
        // Ảnh thật đang có trong thư mục backend/uploads
        imagePath: "/uploads/lap_trinh_java_co_ban.jpg",
      },
      {
        maSach: "S002",
        tenSach: "Cấu trúc dữ liệu & Giải thuật",
        donGia: 150000,
        soQuyen: 5,
        namXuatBan: 2023,
        maNXB: nxbs[1]._id,
        nguonGoc: "Mua mới",
        maTacGia: tgs[1]._id,
        imagePath: "/uploads/cau_truc_du_lieu.jpg",
      },
      {
        maSach: "S003",
        tenSach: "Giáo trình lập trình WEB",
        donGia: 180000,
        soQuyen: 12,
        namXuatBan: 2022,
        maNXB: nxbs[2]._id,
        nguonGoc: "Mua mới",
        maTacGia: tgs[2]._id,
        imagePath: "/uploads/giao_trinh_lap_trinh_web.jpg", // có thể tạo file rỗng để test
      },
      {
        maSach: "S004",
        tenSach: "Học sâu",
        donGia: 135000,
        soQuyen: 8,
        namXuatBan: 2021,
        maNXB: nxbs[3]._id,
        nguonGoc: "Tài trợ",
        maTacGia: tgs[3]._id,
        imagePath: "/uploads/hoc_sau.jpg",
      },
      {
        maSach: "S005",
        tenSach: "Kiến trúc máy tính",
        donGia: 200000,
        soQuyen: 6,
        namXuatBan: 2020,
        maNXB: nxbs[4]._id,
        nguonGoc: "Tài trợ",
        maTacGia: tgs[4]._id,
        imagePath: "/uploads/kien_truc_may_tinh.jpg",
      },
      {
        maSach: "S006",
        tenSach: "100 bài tập lập trình",
        donGia: 160000,
        soQuyen: 9,
        namXuatBan: 2024,
        maNXB: nxbs[0]._id,
        nguonGoc: "Mua mới",
        maTacGia: tgs[5]._id,
        imagePath: "/uploads/100_bai_tap_lap_trinh.jpg",
      },
      {
        maSach: "S007",
        tenSach: "Gián điệp mạng",
        donGia: 210000,
        soQuyen: 7,
        namXuatBan: 2021,
        maNXB: nxbs[1]._id,
        nguonGoc: "Mua mới",
        maTacGia: tgs[6]._id,
        imagePath: "/uploads/gián diệp mạng.jpg",
      },
      {
        maSach: "S008",
        tenSach: "Thị giác máy tính và ứng dụng robotics",
        donGia: 230000,
        soQuyen: 11,
        namXuatBan: 2022,
        maNXB: nxbs[2]._id,
        nguonGoc: "Mua mới",
        maTacGia: tgs[7]._id,
        imagePath: "/uploads/thi-giac-may-tinh-va-ung-dung-robotics.jpg",
      },
      {
        maSach: "S009",
        tenSach: "Phát triển ứng dụng Web",
        donGia: 175000,
        soQuyen: 13,
        namXuatBan: 2023,
        maNXB: nxbs[3]._id,
        nguonGoc: "Mua mới",
        maTacGia: tgs[8]._id,
        imagePath: "/uploads/book09.jpg",
      },
      {
        maSach: "S010",
        tenSach: "Machine Learning cơ bản",
        donGia: 250000,
        soQuyen: 4,
        namXuatBan: 2024,
        maNXB: nxbs[4]._id,
        nguonGoc: "Mua mới",
        maTacGia: tgs[9]._id,
        imagePath: "/uploads/book10.jpg",
      },
    ]);

    // ================== Độc giả mẫu ==================
    console.log("👤 Tạo độc giả mẫu...");
    const hashed = await bcrypt.hash("reader123", 8);

    // ⚠️ ĐOẠN NÀY PHẢI KHỚP VỚI models/DocGia.js
    const docGia = await DocGia.create({
      maDocGia: "DG01",
      hoLot: "Mai Trần Ngọc", // <= nếu schema khác thì sửa lại
      ten: "Trân",
      phai: "Nữ",
      ngaySinh: new Date("2004-01-01"),
      diaChi: "Hậu Giang",
      dienThoai: "0912345678",
      email: "reader@example.com",
      password: hashed,
    });

    console.log("   ✅ Đã tạo độc giả:", docGia.email);

    // ================== Lịch sử mượn ==================
    console.log("📝 Tạo lịch sử mượn sách...");
    const today = new Date();
    const henTra1 = new Date(today);
    henTra1.setDate(henTra1.getDate() + 7);

    const henTra2 = new Date(today);
    henTra2.setDate(henTra2.getDate() + 3);

    await TheoDoiMuonSach.insertMany([
      {
        maDocGia: docGia._id,
        maSach: sachs[0]._id,
        ngayMuon: today,
        ngayHenTra: henTra1,
        trangThai: "Đã duyệt",
      },
      {
        maDocGia: docGia._id,
        maSach: sachs[1]._id,
        ngayMuon: today,
        ngayHenTra: henTra2,
        trangThai: "Chờ duyệt",
      },
    ]);

    console.log("🎉 SEED DỮ LIỆU THÀNH CÔNG!");
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔚 Đã đóng kết nối MongoDB");
  }
}

// Chỉ chạy khi gọi trực tiếp: `node seedData.js`
if (require.main === module) {
  run();
}

module.exports = run;
