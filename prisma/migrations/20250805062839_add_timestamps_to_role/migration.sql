-- AlterTable
-- Thêm cột "createdAt" với giá trị mặc định cho các dòng cũ
ALTER TABLE "Role" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Thêm cột "updatedAt" và tạm thời điền giá trị cho các dòng cũ bằng thời gian hiện tại
-- Quan trọng: Chúng ta dùng `DEFAULT CURRENT_TIMESTAMP` ở đây chỉ để điền dữ liệu cũ.
ALTER TABLE "Role" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;