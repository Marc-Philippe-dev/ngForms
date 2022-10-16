import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup , ValidatorFn, Validators} from '@angular/forms';
import { User } from './user';

function ratingRangeValidator(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {

    if ((c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) || c.value === null) return { 'rangeError': true }

    return null
  }
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null{
  
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl?.pristine || confirmEmailControl?.pristine) {
    return null;
  }

  if (emailControl?.value === confirmEmailControl?.value) {
    return null;
  }

  return {'match':true}
}
 
@Component({
  selector: 'app-register',
  templateUrl:'./register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  registerForm: FormGroup
  
  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      firstName:  ['' , [Validators.required , Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail:['' ,[ Validators.required , Validators.email]]
      } , {validators: emailMatcher}),
      phone: '',
      notification: 'email',
      rating:[null, ratingRangeValidator(1,5)],
      sendCatalog: false
    })

    this.registerForm.get('notification')?.valueChanges.subscribe(
      value => this.setNotificationSetting(value)
    )
  }
 
  fillRegisterForm() {
    this.registerForm.setValue({
      lastName: 'GNANCADJA',
      firstName: 'Philippe',
      email: 'markus@test.com',
      sendCatalog:true
    })
  }

  saveUser() {
    console.log(this.registerForm);
    console.log(this.registerForm);
    console.log('Values:', JSON.stringify(this.registerForm.value));
    console.log("Hello");
  }

  setNotificationSetting(method: string) {
    const phoneControl = this.registerForm.get('phone');

    if (method === 'text') {
      phoneControl?.setValidators(Validators.required)
    } else {
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
  }
}
