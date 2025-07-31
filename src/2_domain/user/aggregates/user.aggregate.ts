export class UserAggregate {
  id: string;
  email: string;
  password: string; // << THÊM DÒNG NÀY
  firstName: string;
  lastName: string;
  dob: Date | null; // Cập nhật kiểu dữ liệu cho đúng
  gender: string | null; // Cập nhật kiểu dữ liệu cho đúng
}
