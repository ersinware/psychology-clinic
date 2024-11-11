export function capitalizeWords(string, separator) {
    if (!string)
        return

    return string
        .split(separator ?? " ")
        .map((word) => capitalizeFirstLetter(word))
        .join(separator ?? " ")
}

function capitalizeFirstLetter(string) {
    if (!string)
        return

    string = string.trim()

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export function getUndashedString(string) {
    return capitalizeWords(string.replaceAll('-', ' '))
}