import { Transform } from 'class-transformer';

export function ParseIntDecorator() {
  return Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : undefined), { toClassOnly: true });
}
