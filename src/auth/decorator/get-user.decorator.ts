import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.model';
import { Vendor } from 'src/vendor/vendor.model';

export const GetUser = createParamDecorator(
  (data: keyof User | keyof Vendor | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
