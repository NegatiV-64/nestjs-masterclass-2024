import { Transform } from 'class-transformer';

export function ParseFloat() {
  return Transform(
    (params) => {
      const { value } = params;

      if (typeof value !== 'string') {
        return undefined;
      }

      const parsedValue = parseFloat(value);

      return parsedValue;
    },
    {
      toClassOnly: true,
    },
  );
}
