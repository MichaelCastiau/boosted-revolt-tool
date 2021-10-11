import { NotFoundException } from '@nestjs/common';

export class PortNotFoundException extends NotFoundException {
  constructor() {
    super();
  }
}
