import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'cardHolderName', async: false })
export class CardHolderNameConstraint implements ValidatorConstraintInterface {
  validate(holderName: string) {
    const cardName = holderName.split(' ')

    return cardName.length === 2
  }

  errorMessage() {
    return 'Incorrect card holder name';
  }
}