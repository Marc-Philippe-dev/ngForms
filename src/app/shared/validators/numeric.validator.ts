import { AbstractControl, ValidatorFn } from "@angular/forms"

export class NumericValidator{
	static ratingRangeValidator(min: number, max: number): ValidatorFn {
	return (c: AbstractControl): { [key: string]: boolean } | null => {

		if ((c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) || c.value === null) return { 'rangeError': true }

		return null
	}
}
}