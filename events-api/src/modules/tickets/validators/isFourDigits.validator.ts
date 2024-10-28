import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isFourDigits', async: false })
export class IsFourDigits implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const valueAsString = value.toString();
    return valueAsString.length === 4; 
  }

  defaultMessage(args: ValidationArguments) {
    return 'The last4Digits must be exactly 4 digits long';
  }
}