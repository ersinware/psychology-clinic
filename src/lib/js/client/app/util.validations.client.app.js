import {formatMaxLength,} from "../common/util.validations.client.common"

export function formatOnlyLetterWithSpace(value, newLetter, maxLength) {
	if (maxLength && value.length > maxLength) return {preventDefault: true}

	const charCode = newLetter.charCodeAt(0)
	if (
		(charCode < 65 || charCode > 90) && // A-Z
		(charCode < 97 || charCode > 122) && // a-z
		(charCode < 192 || charCode > 591) && // all other letters
		charCode !== 32 // space
	)
		return {preventDefault: true}
}

export function validate(minLength, maxLength, value, mayContainSpace, mayContainNumber, mayContainDot) {
	const length = value.length
	if (length < minLength || length > maxLength)
		return false

	for (let i = 0; i < length; i++) {
		const charCode = value.charCodeAt(i)
		if (
			(charCode < 65 || charCode > 90) && // A-Z
			(charCode < 97 || charCode > 122) && // a-z
			(!mayContainNumber || charCode < 48 || charCode > 57) && // 0-9
			(!mayContainSpace || charCode !== 32) && // space
			(!mayContainDot || charCode !== 46) && // .
			(charCode < 192 || charCode > 591) // all other letters
		)
			return false
	}

	return true
}

export function formatName(value, newLetter) {
	return formatOnlyLetterWithSpace(value, newLetter, 25)
}

export function validateName(value) {
	return validate(2, 25, value, true)
}

export function formatSurname(value, newLetter) {
	return formatOnyLetter(value, newLetter, 25)
}

export function validateSurname(value) {
	return validate(2, 25, value)
}

export function formatThoughts(value) {
	return formatMaxLength(value, 500)
}

export function validateThoughts(value) {
	return value.length >= 10 && value.length <= 500
}

function formatOnyLetter(value, newLetter, maxLength) {
	if (maxLength && value.length > maxLength) return {preventDefault: true}

	const charCode = newLetter.charCodeAt(0)
	if (
		(charCode < 65 || charCode > 90) && // A-Z
		(charCode < 97 || charCode > 122) && // a-z
		(charCode < 192 || charCode > 591)  // all other letters
	)
		return {preventDefault: true}
}