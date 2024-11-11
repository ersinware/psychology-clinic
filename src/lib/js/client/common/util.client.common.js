import {browser} from '$app/environment'
import {getContext, setContext} from 'svelte'
import {writable} from 'svelte/store'
import {DURATION_RIPPLE_TYPE_ZERO, DURATION_WAIT_FOR_RIPPLE_TYPE_ONE} from './constants.transitions.client.common'
import {registerEscapeInterceptor, unregisterEscapeInterceptor} from './util.inputs.client.common'
import {registerLampClick, unregisterLampClick} from './util.lamp.client.common'
import {goto} from "$app/navigation";
import {waitFor} from "$lib/js/common/util.common.js";

let rippleTargetInfo,
    backButtonInterceptors = [],
    dontInterruptModal

export function init(_rippleTargetInfo, _dontInterruptModal) {
    rippleTargetInfo = _rippleTargetInfo
    dontInterruptModal = _dontInterruptModal

    initZeroTimeout()
}

export function registerInterceptionsForModal(id, f) {
    registerLampClick(id, f)
    registerEscapeInterceptor(id, f)
    registerBackButtonInterceptor(id, f)
}

export function unregisterInterceptionsForModal(id) {
    unregisterLampClick(id)
    unregisterEscapeInterceptor(id)
    unregisterBackButtonInterceptor(id)
}

export function registerBackButtonInterceptor(id, f) {
    backButtonInterceptors.push({id, f})
}

export function unregisterBackButtonInterceptor(id) {
    backButtonInterceptors = backButtonInterceptors.filter((element) => element.id !== id)
}

export function anyBackButtonInterceptor() {
    return backButtonInterceptors.length > 0
}

export function interceptBackButton() {
    backButtonInterceptors[backButtonInterceptors.length - 1].f()
}

function initZeroTimeout() {
    const timeouts = [],
        messageName = "zero-timeout-message"

    function setZeroTimeout(f) {
        timeouts.push(f)
        window.postMessage(messageName, "*")
    }

    function handleMessage(event) {
        if (event.source !== window || event.data !== messageName) return

        event.stopPropagation()

        if (timeouts.length > 0) timeouts.shift()()
    }

    window.addEventListener("message", handleMessage, true)
    window.setZeroTimeout = setZeroTimeout
}

export function getStore(key) {
    return getContext(key)
}

export function createStore(key, defaultValue) {
    setContext(key, writable(defaultValue))
}

export function performRippleEffect(
    event,
    rippleType = 1,
    rippleColor = "var(--ripple-color)",
    borderRadius = "var(--border-radius)"
) {
    const rect = event.currentTarget.getBoundingClientRect()

    rippleTargetInfo.set({
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        clickX: event.clientX,
        clickY: event.clientY,
        rippleType,
        rippleColor,
        borderRadius,
    })
}

export async function performRippleEffectAndWait(event) {
    performRippleEffect(event)
    await waitFor(DURATION_WAIT_FOR_RIPPLE_TYPE_ONE)
}

export async function performRippleEffectForButtonAndWait(event) {
    performRippleEffect(event, 0, "var(--button-ripple-color)", "calc(var(--border-radius) + .25rem)")
    await waitFor(DURATION_RIPPLE_TYPE_ZERO)
}

export function performRippleEffectForButton(event) {
    performRippleEffect(event, 0, "var(--button-ripple-color)", "calc(var(--border-radius) + .25rem)")
}

export function performRippleEffectForCircularButton(event) {
    performRippleEffect(event, 0, "var(--button-ripple-color)", "50%")
}

export async function sendMessageToWorker(data) {
    const registration = await navigator.serviceWorker.ready
    registration.active.postMessage(data)
}

export function areEqualStrings(valueOne, valueTwo) {
    if (!valueOne || !valueTwo)
        return false

    return (
        valueOne
            .toString()
            .trim()
            .toLowerCase()
            .localeCompare(valueTwo.toString().trim().toLowerCase(), undefined, {sensitivity: "accent"}) === 0
    )
}

export function yieldToMain() {
    if (browser && setZeroTimeout)
        return new Promise(resolve => setZeroTimeout(() => queueMicrotask(resolve)))
    else
        return new Promise(resolve => setTimeout(() => queueMicrotask(resolve), 0))
}

export function randomID() {
    return getRandomNumberForID() + getRandomNumberForID() + '-' + getRandomNumberForID() + '-' + getRandomNumberForID() + '-' + getRandomNumberForID() + '-' + getRandomNumberForID() + getRandomNumberForID() + getRandomNumberForID()
}

function getRandomNumberForID() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export async function onLinkClickOnNewTab(event) {
    event.preventDefault()

    const href = event.currentTarget.href

    await performRippleEffectAndWait(event)
    window.open(href, '_blank')
}

export async function onLinkClick(event) {
    event.preventDefault()

    const href = event.currentTarget.href

    await performRippleEffectAndWait(event)
    goto(href)
}

export function isSvg(imageName) {
    return imageName.substring(imageName.length - 3, imageName.length) === 'svg'
}