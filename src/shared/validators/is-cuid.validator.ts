import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import cuid from 'cuid';

// 1. Tạo một lớp Validator
@ValidatorConstraint({ name: 'isCuid', async: false })
export class IsCuidConstraint implements ValidatorConstraintInterface {
  // Logic kiểm tra sẽ nằm ở đây
  validate(value: any, _args: ValidationArguments) {
    // isCuid() là hàm từ thư viện `cuid`
    return typeof value === 'string' && cuid.isCuid(value);
  }

  // Thông báo lỗi mặc định
  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid CUID`;
  }
}

// 2. Tạo Decorator
export function IsCuid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCuidConstraint, // Chỉ định lớp validator sẽ được sử dụng
    });
  };
}
