export function waitFor(delay) {
    return new Promise(resolve => setTimeout(resolve, delay))
}

export function capitalizeFirstLetterOnly(string) {
    if (!string)
        return

    string = string.trim()

    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getDashedString(string) {
    return string.toLowerCase().replace(/ /g, "-")
}

export function formatDateToISOWithOffset(date) {
    const isoString = date.toISOString(),
        [datePart, timePart] = isoString.split('T'),
        [time] = timePart.split('.'),
        offsetMinute = '00'

    return `${datePart}T${time}+03:${offsetMinute}`;
}