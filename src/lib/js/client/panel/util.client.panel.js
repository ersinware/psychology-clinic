import { goto, invalidateAll } from "$app/navigation";
import { EVENT_CLEAR_PROTECTED_CACHE } from "$lib/js/client/common/constants.client.common.js";
import { DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED } from "$lib/js/client/common/constants.transitions.client.common.js";
import { performRippleEffectAndWait, sendMessageToWorker } from "$lib/js/client/common/util.client.common.js";
import { showErrorSnackbar, showPositiveSnackbar } from "$lib/js/client/common/util.snackbars.client.common.js";
import { EVENT_TEXT_EDITOR_UPDATED } from "$lib/js/common/constants.common";
import { waitFor } from "$lib/js/common/util.common.js";

const beingTrackedForms = new Map()

export async function onSignOutClick(event) {
    await performRippleEffectAndWait(event)

    const response = await fetch('/yönetim-paneli/api/user/sign-out', { method: 'PUT' })
    if (response.status !== 200) {
        showErrorSnackbar((await response.json()).error)

        return
    }

    await goto("/panele-giriş-yap", { replaceState: true })
    await waitFor(DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED)
    await invalidateAll()

    showPositiveSnackbar("Oturumunuz başarıyla kapatıldı.")

    sendMessageToWorker({ type: EVENT_CLEAR_PROTECTED_CACHE })
}

export function trackFormForDifference(form, dataAtFirst, callback) {
    const _dataAtFirst = structuredClone(dataAtFirst)

    for (const property in _dataAtFirst)
        _dataAtFirst[property] = _dataAtFirst[property].toString()

    beingTrackedForms.set(form.id, { form, dataAtFirst: _dataAtFirst, callback })
    onInput({ form, dataAtFirst: _dataAtFirst, callback })

    form.addEventListener("input", onInput)
    window.addEventListener(`${EVENT_TEXT_EDITOR_UPDATED}_${form.id}`, onTextEditorInput)
}

export function removeTrackingFormDifference(form) {
    if (!beingTrackedForms.has(form.id))
        return

    form.removeEventListener('input', onInput)
    window.removeEventListener(`${EVENT_TEXT_EDITOR_UPDATED}_${form.id}`, onTextEditorInput)

    beingTrackedForms.delete(form.id)
}

async function onInput(event) {
    if (event?.target?.getAttribute('contenteditable') === 'true')
        return

    const { form, callback, dataAtFirst } = event.currentTarget ? beingTrackedForms.get(event.currentTarget.id) : event

    for (const node of form.querySelectorAll("input, textarea")) {
        if (node.type === 'file')
            continue

        if (!areEqualStrings(dataAtFirst[node.id], node.value ?? await node.getContent())) {
            callback(false)

            return
        }
    }

    callback(true)
}

async function onTextEditorInput(event) {
    const { callback, dataAtFirst } = beingTrackedForms.get(event.detail.formId)

    if (!areEqualStrings(dataAtFirst[event.detail.id], await document.getElementById(event.detail.id).getContent())) {
        callback(false)

        return
    }

    callback(true)
}

function areEqualStrings(valueOne, valueTwo) {
    if (!valueOne || !valueTwo)
        return false

    return (
        valueOne
            .toString()
            .trim()
            .toLowerCase()
            .localeCompare(valueTwo.toString().trim().toLowerCase(), undefined, { sensitivity: "accent" }) === 0
    )
}