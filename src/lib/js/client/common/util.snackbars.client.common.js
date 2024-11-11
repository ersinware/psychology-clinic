import { randomID } from '$lib/js/client/common/util.client.common.js'
import { get } from 'svelte/store'
import {waitFor} from "$lib/js/common/util.common.js";

let openSnackbars, bigScreen

export function init(_openSnackbars, _bigScreen) {
    openSnackbars = _openSnackbars
    bigScreen = _bigScreen
}

export async function showSnackbar(snackbar, delay) {
    const temp = get(openSnackbars)
    snackbar.id = randomID()

    if (!get(bigScreen))
        temp.push(snackbar)
    else
        temp.unshift(snackbar)

    openSnackbars.set(temp)

    const _delay = delay ?? (temp.length > 0 ? 5000 + temp.length * 1000 : 5000)
    await waitFor(_delay)
    closeSnackbar(snackbar.id)
}

export function closeSnackbar(id) {
    const temp = get(openSnackbars).filter(_snackbar => _snackbar.id !== id)
    openSnackbars.set(temp)
}

export function showErrorSnackbar(error, actions) {
    showSnackbar({ content: error ?? 'Bir hata meydana geldi. Daha sonra tekrar deneyin.', backgroundColor: 'var(--error-color)', dividerColor: "rgb(255, 255, 255, .4)", actions })
}

export function showPositiveSnackbar(message, actions) {
    showSnackbar({ content: message, backgroundColor: 'var(--positive-color)', dividerColor: "rgb(255, 255, 255, .4)", actions })
}