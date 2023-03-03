import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

export function thrower(err: any) {
  if (err instanceof NotFoundException) {
    console.error(err?.getResponse());
    throw new NotFoundException(err.message);
  }
  if (err instanceof ForbiddenException) {
    console.error(err?.getResponse());
    throw new ForbiddenException(err.message);
  }
  if (err instanceof NotAcceptableException) {
    console.error(err?.getResponse());
    throw new NotAcceptableException(err.message);
  }
  if (err?.code === 11000) {
    throw new BadRequestException(
      `Sorry, ${Object.keys(err?.keyPattern)} are already exists !`,
    );
  }
  if (err?.code === 16755)
    throw new BadRequestException(
      `Sorry, Invalid coordinates provided as location !`,
    );
  if (err?.message.includes('validation'))
    throw new BadRequestException(
      `Invalid input for ${Object.keys(err?.errors)}.`,
    );
  console.error(err);
  throw new InternalServerErrorException(err?.message);
}
