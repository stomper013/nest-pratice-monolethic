import { ValidationError } from '@nestjs/common';

export function errorFormatter(
  errors: ValidationError[],
  errMessage?: any,
  parentFields?: string,
): any {
  const message = errMessage || {};
  let errorField = '';
  let validationList = [];

  errors.forEach((error) => {
    errorField = parentFields
      ? `${parentFields}.${error.property}`
      : error?.property;

    if (!error?.constraints && error?.children?.length) {
      errorFormatter(error.children, message, errorField);
    } else {
      validationList = Object.values(error?.constraints);
      message[errorField] =
        validationList.length > 0 ? validationList.pop() : `Invalid value!`;
    }
  });
  return message;
}
