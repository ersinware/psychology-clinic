import {formatMaxLength} from "$lib/js/client/common/util.validations.client.common.js";

export function validateArticleTitle(value) {
    return validateMaxLength(value, 2, 50)
}

export function formatArticleTitle(value) {
    return formatMaxLength(value, 50)
}

export function validateArticleFirstSentence(value) {
    return validateMaxLength(value, 10, 500)
}

export function formatArticleFirstSentence(value) {
    return formatMaxLength(value, 500)
}

export function validateArticleContent(value) {
    return validateMaxLength(value, 100, 999999)
}

function validateMaxLength(value, minLength, maxLength) {
    const length = value.length
    return !(length < minLength || length > maxLength);
}