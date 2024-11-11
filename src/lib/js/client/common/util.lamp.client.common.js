import {performRippleEffectAndWait} from "$lib/js/client/common/util.client.common"
import {anyOpenModal, closeLastModal} from "$lib/js/client/common/util.modals.client.common"
import {get} from "svelte/store"

let lampInterceptors = [],
    lastLampClickedAt = Date.now(),
    dontInterruptModal

export function init(_dontInterruptModal) {
    dontInterruptModal = _dontInterruptModal
}

export function openLamp() {
    document.getElementById("lamp").classList.remove("close-lamp")
    allowScroll()
}

export function closeLamp() {
    document.getElementById("lamp").classList.add("close-lamp")
    cancelScroll()
}

export function cancelScroll() {
    document.querySelectorAll("[data-scrollable]").forEach((node) => node.classList.add("o-y-hidden"))
}

export function allowScroll() {
    document.querySelectorAll("[data-scrollable]").forEach((node) => node.classList.remove("o-y-hidden"))
}

export function registerLampClick(id, f) {
    lampInterceptors.push({id, f})
}

export function unregisterLampClick(id) {
    lampInterceptors = lampInterceptors.filter((element) => element.id !== id)
}

export async function onLampClick(event) {
    const now = Date.now()

    if (now - lastLampClickedAt < 750) return

    lastLampClickedAt = now

    if (lampInterceptors.length > 0) {
        lampInterceptors[lampInterceptors.length - 1].f(event)

        return
    }

    if (!get(dontInterruptModal) && anyOpenModal()) {
        await performRippleEffectAndWait(event)

        if (anyOpenModal()) closeLastModal()
    }
}
