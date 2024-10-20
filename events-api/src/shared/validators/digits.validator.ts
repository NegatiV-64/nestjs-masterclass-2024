import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { DigitsRegex } from '../constants/digits-regex.constant';

export function IsDigitsValid(numDigits: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDigitsValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [numDigits],
      options: validationOptions,
      validator: {
        validate(value: unknown, validationArguments: ValidationArguments): boolean {
          const [numDigits] = validationArguments.constraints;

          if (typeof value !== 'string' || value.length !== numDigits) {
            return false;
          }

          return DigitsRegex.test(value);
        },
        defaultMessage(validationArguments) {
          return `${validationArguments?.property} must be a number with ${validationArguments?.constraints[0]} digits`;
        },
      },
    });
  };
}
