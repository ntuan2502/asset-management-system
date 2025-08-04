import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { GqlContext } from 'src/shared/types/context.types'; // << IMPORT

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // Sử dụng generic type để báo cho GqlExecutionContext biết
    // hình dạng của context mà chúng ta mong đợi.
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    return ctx.req;
  }
}
