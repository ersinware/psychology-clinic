import {anyOpenModal, closeLastModal} from "$lib/js/client/common/util.modals.client.common"
import {get} from "svelte/store"

let dontInterruptModal,
    escapeInterceptors = []

export function init(_dontInterruptModal) {
    dontInterruptModal = _dontInterruptModal

    addOnKeyDownListener()
}

export function registerEscapeInterceptor(id, f) {
    escapeInterceptors.push({id, f})
}

export function unregisterEscapeInterceptor(id) {
    escapeInterceptors = escapeInterceptors.filter((element) => element.id !== id)
}

function addOnKeyDownListener() {
    if (document.onkeydown) return

    document.onkeydown = (event) => {
        if (event.key === "Escape" || event.keyCode === 27) {
            if (escapeInterceptors.length > 0) {
                escapeInterceptors[escapeInterceptors.length - 1].f()

                return
            }

            if (!get(dontInterruptModal) && anyOpenModal())
                closeLastModal()

            return
        }

        if ((event.key === "Tab" || event.keyCode === 9)) {
            event.preventDefault()
            focusNext()

            return
        }

        if ((event.key === "Enter" || event.keyCode === 13) && document.activeElement.contentEditable !== 'true')
            event.preventDefault()
    }
}

function focusNext() {
    const inputs = Array.prototype.slice.call(document.querySelectorAll("[contenteditable], input:not(:disabled, [type=file]), textarea:not(:disabled)"))

    if (!inputs || !inputs?.length)
        return

    let nextIndex = inputs.indexOf(document.activeElement) + 1
    if (nextIndex > inputs.length - 1)
        nextIndex = 0

    const next = inputs[nextIndex]

    next.scrollIntoView({block: 'center', behavior: 'instant'})
    next.focus()
}