import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import dayjs from 'dayjs';

@ValidatorConstraint({ name: 'cardExpiry', async: false })
export class CardExpiryConstraint implements ValidatorConstraintInterface {
  validate(expiryDate: string) {
    const date = dayjs(expiryDate, 'MM/YY', true)
    if (!date.isValid()) {
      return false
    }

    const [month, expirationYear] = expiryDate.split('/')
    const currentYear = (new Date().getFullYear()) % 100;
    const currentMonth = (new Date().getMonth()) + 1

    const cardMonth = parseInt(month, 10)
    const cardYear = parseInt(expirationYear, 10)

    if (
      cardYear < currentYear ||
      (cardYear === currentYear && cardMonth < currentMonth)
    ) {
      return false
    }

    return true
  }

  errorMessage() {
    return 'The expiration date of your card is incorrect or expired';
  }
}