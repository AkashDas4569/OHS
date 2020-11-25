import { Validators } from '@angular/forms';

export interface AddFormControl {
  name: string;
  value?: '' | any;
  validators: Validators | null;
}
