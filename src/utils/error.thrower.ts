import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function thrower(err: any) {
  console.error(err?.message);
  if (err instanceof NotFoundException)
    throw new NotFoundException(err.message);
  if (err instanceof ForbiddenException)
    throw new ForbiddenException(err.message);
  if (err?.code === 11000)
    throw new BadRequestException(
      `Duplicate entries for ${Object.keys(err?.keyPattern)}`,
    );
  if (err?.message.includes('validation'))
    throw new BadRequestException(
      `Invalid input for ${Object.keys(err?.errors)}.`,
    );
  throw new InternalServerErrorException(err?.message);
}
