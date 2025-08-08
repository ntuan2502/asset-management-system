import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from 'src/shared/types/context.types'; // << IMPORT

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // SỬA LẠI: Lấy context đã được định kiểu
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    return ctx.req.user;
  },
);
