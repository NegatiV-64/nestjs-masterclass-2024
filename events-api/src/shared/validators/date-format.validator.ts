import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { time } from '../libs/time.lib';
import { TimeFormat } from '../constants/time.constant';
import { ObjectValues } from '../types/utility.type';

export function IsDateFormatValid(format: ObjectValues<typeof TimeFormat>, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormatValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [format],
      options: validationOptions,
      validator: {
        validate(value: unknown, validationArguments: ValidationArguments): boolean {
          const [format] = validationArguments.constraints;

          if (typeof value !== 'string') {
            return false;
          }

          const isValidDate = time(value, format, true).isValid();

          return isValidDate;
        },
        defaultMessage(validationArguments) {
          return `${validationArguments?.property} must be a valid date in ${validationArguments?.constraints[0]} format`;
        },
      },
    });
  };
}
