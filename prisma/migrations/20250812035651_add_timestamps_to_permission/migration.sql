-- AlterTable
-- Thêm cột "createdAt" với giá trị mặc định cho các dòng cũ.
ALTER TABLE "Permission" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Thêm cột "updatedAt" và tạm thời điền giá trị cho các dòng cũ bằng thời gian hiện tại.
ALTER TABLE "Permission" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;