import { PipeTransform, Injectable } from '@nestjs/common';
import { convertSnakeToCamelCase } from '../utils/convert-snake-to-camel-case';

@Injectable()
export class SnakeToCamelCasePipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'object') {
      return value;
    }

    const newObject = {};

    for (const key in value) {
      const newKey = convertSnakeToCamelCase(key);
      newObject[newKey] = value[key];
    }

    return newObject;
  }
}
