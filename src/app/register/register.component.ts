import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControlName, FormGroup, ValidatorFn, Validators, FormArray } from '@angular/forms';
import { debounceTime, fromEvent, merge, Observable } from 'rxjs';
import { emailMatcher } from '../shared/validators/email-matcher-validator';
import { GlobalGenericValidator } from '../shared/validators/global-generic.validator';
import { NumericValidator } from '../shared/validators/numeric.validator';
import { User } from './user';





@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) inputElements: ElementRef[];
  user: User = new User();
  registerForm: FormGroup;
  formErrors: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } } = {
    
    firstName: {
      required: "Entrez votre prénom",
      maxlength: "Maximum 20 caractères"
    },
    lastName: {
      required: "Entrez votre nom",
      minlength: "Minimum 4 caractères"
    },
    email: {
      required: "Entrer votre email",
      email:"Email invalide"
    },
    confirmEmail: {
      required: "Merci de confirmer votre email",
      email: "Merci de rentrer un mail valide" 
    },
    phone: {
      required: "Veuillez rentrer votre numero de telephone."
    },
    rating: {
      rangeError: "Veuillez noter nos services sur une echelle de 1 à 5."
    }

  }

  private globalGenericValidator: GlobalGenericValidator;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.globalGenericValidator = new GlobalGenericValidator(this.validationMessages);

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]]
      }, { validators: emailMatcher }),
      phone: '',
      notification: 'email',
      rating: [null, NumericValidator.ratingRangeValidator(1, 5)],
      sendCatalog: true,
      addresses: this.fb.array([this.createAddressGroup()])
    })


    this.registerForm.get('notification')?.valueChanges.subscribe(
      value => this.setNotificationSetting(value)
    )


  }

  ngAfterViewInit() {
    const formControlBlurs: Observable<unknown>[] = this.inputElements.map(
      (formControlElement: ElementRef) => fromEvent(formControlElement.nativeElement, 'blur')
    )

    merge(this.registerForm.valueChanges, ...formControlBlurs)
      .pipe(debounceTime(1000) )
      .subscribe(() => {
        this.formErrors = this.globalGenericValidator.createErrorMessage(this.registerForm);
        console.log('Errors:', this.formErrors);
      })
  }

  get addressList(): FormArray{
    return this.registerForm.get('addresses') as FormArray
  }

  addAddress() {
    this.addressList.push(this.createAddressGroup());
  }

  fillRegisterForm() {
    this.registerForm.setValue({
      lastName: 'GNANCADJA',
      firstName: 'Philippe',
      email: 'markus@test.com',
      sendCatalog: true
    })
  }

  saveUser() {
    /*  console.log(this.registerForm);
     console.log(this.registerForm);
     console.log('Values:', JSON.stringify(this.registerForm.value));
     console.log("Hello"); */
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

  private createAddressGroup(): FormGroup {
    return this.fb.group({
      addressType: [''],
      street1: [''],
      street2: [''],
      city: [''],
      state: [''],
      zip: ['']
    })
  }
}
