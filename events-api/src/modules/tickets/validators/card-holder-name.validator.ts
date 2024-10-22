import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCardHolderNameValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(holderName: string) {
          const cardName = holderName.split(' ');
          return cardName.length === 2;
        },

        defaultMessage() {
          return 'Incorrect card holder name';
        }
      },
    });
  };
}
