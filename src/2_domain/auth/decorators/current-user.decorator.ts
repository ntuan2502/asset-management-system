import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from 'src/shared/types/context.types'; // << IMPORT

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    // Bây giờ ctx.req.user có kiểu rõ ràng là UserAggregate
    return ctx.req.user;
  },
);
