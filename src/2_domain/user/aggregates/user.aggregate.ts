// Tạm thời aggregate này chỉ chứa dữ liệu,
// sau này chúng ta sẽ thêm các phương thức nghiệp vụ vào đây
export class UserAggregate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;

  // Ví dụ phương thức nghiệp vụ sau này có thể thêm vào:
  // changeName(firstName: string, lastName: string) { ... }
}
