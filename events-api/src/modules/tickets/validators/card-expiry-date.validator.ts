import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCardExpiryValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(expiryDate: string):boolean {
          const [month, expirationYear] = expiryDate.split('/');
          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;

          const cardMonth = parseInt(month, 10);
          const cardYear = parseInt(expirationYear, 10);

          return cardYear > currentYear || (cardYear === currentYear && cardMonth > currentMonth);
        },

        defaultMessage() {
          return 'The expiration date of your card is incorrect or expired';
        }
      },
    });
  };
}
