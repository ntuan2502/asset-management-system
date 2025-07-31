import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { UserCreatedEvent } from 'src/2_domain/user/events/user-created.event';
import { UserDeletedEvent } from 'src/2_domain/user/events/user-deleted.event';

// @EventsHandler nhận vào một hoặc nhiều lớp sự kiện mà nó muốn lắng nghe.

@Injectable()
@EventsHandler(UserCreatedEvent, UserDeletedEvent)
export class UserProjector
  implements IEventHandler<UserCreatedEvent | UserDeletedEvent>
{
  constructor(private readonly prisma: PrismaService) {}

  // Phương thức handle sẽ được gọi tự động khi một trong các sự kiện trên được phát ra.
  async handle(event: UserCreatedEvent | UserDeletedEvent) {
    // Chúng ta kiểm tra kiểu của sự kiện để biết phải làm gì.
    if (event instanceof UserCreatedEvent) {
      await this.onUserCreated(event);
    } else if (event instanceof UserDeletedEvent) {
      await this.onUserDeleted(event);
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
}
