import {browser} from "$app/environment"

export function onValidityChange(array) {
    if (!browser) return false

    return !array.includes(false) && !array.includes(undefined)
}

export function formatMaxLength(value, maxLength) {
    if (value.length > maxLength)
        return {preventDefault: true}
}

export function validateEmailAddress(value) {
    return /^\w+([\._-]?\w+)*@\w+([\._-]?\w+)*(\.\w{2,3})+$/.test(value)
}
