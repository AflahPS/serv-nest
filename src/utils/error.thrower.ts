import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

export function thrower(err: any) {
  console.error(err?.message);
  if (err instanceof NotFoundException)
    throw new NotFoundException(err.message);
  if (err instanceof ForbiddenException)
    throw new ForbiddenException(err.message);
  if (err instanceof NotAcceptableException)
    throw new NotAcceptableException(err.message);
  if (err?.code === 11000)
    throw new BadRequestException(
      `Sorry, ${Object.keys(err?.keyPattern)} are already exists !`,
    );
  if (err?.message.includes('validation'))
    throw new BadRequestException(
      `Invalid input for ${Object.keys(err?.errors)}.`,
    );
  throw new InternalServerErrorException(err?.message);
}
