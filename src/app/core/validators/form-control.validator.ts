import { Errors } from '../utilities';
import { FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';

export function FormControlValidator(field: AbstractControl, validatorFieldName: string) {
  const errors = Errors;
  let validationItem: {
    type: '',
    message: ''
  } = {
    type: '',
    message: ''
  };
  if (field && (field.dirty || field.touched)) {
    errors[validatorFieldName].find((item: any) => {
      if (
        field.hasError(item.type)
      ) {
        validationItem = item;
        return item;
      }
    });
  }
  return validationItem;
}
