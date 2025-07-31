import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { UserCreatedEvent } from 'src/2_domain/user/events/user-created.event';
import { UserDeletedEvent } from 'src/2_domain/user/events/user-deleted.event';
import { UserUpdatedEvent } from 'src/2_domain/user/events/user-updated.event'; // << IMPORT SỰ KIỆN MỚI
import { Gender, Prisma } from '@prisma/client'; // << IMPORT PRISMA VÀ GENDER

// @EventsHandler nhận vào một hoặc nhiều lớp sự kiện mà nó muốn lắng nghe.

@Injectable()
@EventsHandler(UserCreatedEvent, UserDeletedEvent, UserUpdatedEvent)
export class UserProjector
  implements
    IEventHandler<UserCreatedEvent | UserDeletedEvent | UserUpdatedEvent>
{
  constructor(private readonly prisma: PrismaService) {}

  // Phương thức handle sẽ được gọi tự động khi một trong các sự kiện trên được phát ra.
  async handle(event: UserCreatedEvent | UserDeletedEvent | UserUpdatedEvent) {
    // Chúng ta kiểm tra kiểu của sự kiện để biết phải làm gì.
    if (event instanceof UserCreatedEvent) {
      await this.onUserCreated(event);
    } else if (event instanceof UserDeletedEvent) {
      await this.onUserDeleted(event);
    } else if (event instanceof UserUpdatedEvent) {
      // << THÊM NHÁNH XỬ LÝ MỚI
      await this.onUserUpdated(event);
    }
  }

  private async onUserCreated(event: UserCreatedEvent): Promise<void> {
    console.log('Projector caught UserCreatedEvent:', event); // Thêm log để debug
    await this.prisma.user.create({
      data: {
        id: event.id,
        email: event.email,
        password: event.hashedPassword,
        firstName: event.firstName,
        lastName: event.lastName,
        dob: event.dob, // << THÊM MỚI
        // SỬA LỖI: Chuyển đổi string thành Gender enum
        gender: event.gender ? (event.gender as Gender) : null,
        createdAt: event.createdAt,
        updatedAt: event.createdAt, // Cập nhật cả updatedAt khi tạo
      },
    });
  }

  private async onUserDeleted(event: UserDeletedEvent): Promise<void> {
    console.log('Projector caught UserDeletedEvent:', event); // Thêm log để debug
    await this.prisma.user.update({
      where: {
        id: event.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // --- THÊM MỚI PHƯƠNG THỨC XỬ LÝ UPDATE ---
  private async onUserUpdated(event: UserUpdatedEvent): Promise<void> {
    console.log('Projector caught UserUpdatedEvent:', event); // Thêm log để debug

    // --- BẮT ĐẦU PHẦN SỬA LỖI ---

    // 1. Khai báo `dataToUpdate` với kiểu `Prisma.UserUpdateInput`.
    // Đây là kiểu dữ liệu mà `prisma.user.update` mong đợi.
    const dataToUpdate: Prisma.UserUpdateInput = {
      updatedAt: event.updatedAt, // Luôn cập nhật updatedAt
    };

    // 2. Kiểm tra và thêm các trường đã thay đổi.
    // Các thao tác gán này giờ đây hoàn toàn an toàn về kiểu.
    if (event.firstName !== undefined) {
      dataToUpdate.firstName = event.firstName;
    }
    if (event.lastName !== undefined) {
      dataToUpdate.lastName = event.lastName;
    }
    if (event.dob !== undefined) {
      dataToUpdate.dob = event.dob;
    }
    if (event.gender !== undefined) {
      dataToUpdate.gender = event.gender ? (event.gender as Gender) : null;
    }

    // 3. Thực thi lệnh UPDATE với đối tượng data đã có kiểu đúng.
    await this.prisma.user.update({
      where: {
        id: event.id,
      },
      data: dataToUpdate,
    });

    // --- KẾT THÚC PHẦN SỬA LỖI ---
  }
}
