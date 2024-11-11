import { get } from "svelte/store"
// import { anyOpenModal, closeAllModalsOnScreenChange } from './util.modals.client.common'

let onMountTouchableQueue = [],
    onMountTouchableReverseQueue = [],
    onMountHoverableQueue = [],
    onMountHoverableReverseQueue = [],
    onMountBigScreenQueue = [],
    onMountSmallScreenQueue = [],
    onMountBigScreenReverseQueue = [],
    onMountSmallScreenReverseQueue = [],
    touchable,
    hoverable,
    bigScreen

export async function init(_touchable, _hoverable, _bigScreen) {
    touchable = _touchable
    hoverable = _hoverable
    bigScreen = _bigScreen

    setupTouchable()
    setupHoverable()
    setupBigScreen()
}

function setupTouchable() {
    const mqlTouchable = window.matchMedia("((hover: none) and (pointer: fine)) or ((hover: none) and (pointer: coarse)) or ((hover: hover) and (pointer: coarse))")
    touchable.set(mqlTouchable.matches)
    addTouchableListener(mqlTouchable)
}

function addTouchableListener(mql) {
    mql.addEventListener("change", (query) => {
        touchable.set(query.matches)

        if (query.matches)
            onTouchable()
        else
            onTouchableReverse()
    })
}

function onTouchable() {
    for (const element of onMountTouchableQueue) element.onMount()
}

function onTouchableReverse() {
    for (const element of onMountTouchableReverseQueue) element.reverse()
}

export function onMountTouchable(param) {
    onMountTouchableQueue.push(param)
    if (get(touchable))
        param.onMount()
}

export function onMountTouchableReverse(param) {
    onMountTouchableReverseQueue.push(param)
}

export function removeOnTouchable(id) {
    onMountTouchableQueue = onMountTouchableQueue.filter((item) => item.id !== id)
}

export function removeOnTouchableReverse(id) {
    onMountTouchableReverseQueue = onMountTouchableReverseQueue.filter((item) => item.id !== id)
}

export function removeOnTouchableListeners(id) {
    removeOnTouchable(id)
    removeOnTouchableReverse(id)
}

function setupHoverable() {
    const mqlHoverable = window.matchMedia("(hover: hover)")
    hoverable.set(mqlHoverable.matches)
    addHoverableListener(mqlHoverable)
}

function addHoverableListener(mql) {
    mql.addEventListener("change", (query) => {
        hoverable.set(query.matches)

        if (query.matches)
            onHoverable()
        else
            onHoverableReverse()
    })
}

function onHoverable() {
    for (const element of onMountHoverableQueue)
        element.onMount()
}

function onHoverableReverse() {
    for (const element of onMountHoverableReverseQueue)
        element.reverse()
}

export function onMountHoverable(param) {
    onMountHoverableQueue.push(param)
    if (get(hoverable))
        param.onMount()
}

export function onMountHoverableReverse(param) {
    onMountHoverableReverseQueue.push(param)
}

export function removeOnHoverable(id) {
    onMountHoverableQueue = onMountHoverableQueue.filter((item) => item.id !== id)
}

export function removeOnHoverableReverse(id) {
    onMountHoverableReverseQueue = onMountHoverableReverseQueue.filter((item) => item.id !== id)
}

export function removeOnHoverableListeners(id) {
    removeOnHoverable(id)
    removeOnHoverableReverse(id)
}

export function removeAllPointerRelated(id) {
    removeOnTouchable(id)
    removeOnTouchableReverse(id)
    removeOnHoverable(id)
    removeOnHoverableReverse(id)
}

function setupBigScreen() {
    const mqlBigScreen = window.matchMedia("(min-width: 65.001em)")
    bigScreen.set(mqlBigScreen.matches)
    addBigScreenListener(mqlBigScreen)
}

function addBigScreenListener(mql) {
    mql.addEventListener("change", (query) => {
        bigScreen.set(query.matches)

        if (query.matches)
            onBigScreen()
        else
            onSmallScreen()
    })
}

function onBigScreen() {
    for (const element of onMountSmallScreenReverseQueue)
        element.reverse()

    for (const element of onMountBigScreenQueue)
        element.onMount()
}

export function onMountBigScreen(param) {
    onMountBigScreenQueue.push(param)
    if (get(bigScreen))
        param.onMount()
}

export function onMountBigScreenReverse(param) {
    onMountBigScreenReverseQueue.push(param)
}

export function removeOnMountBigScreen(id) {
    onMountBigScreenQueue = onMountBigScreenQueue.filter((item) => item.id !== id)
}

export function removeOnMountBigScreenReverse(id) {
    onMountBigScreenReverseQueue = onMountBigScreenReverseQueue.filter((item) => item.id !== id)
}

export function removeBigScreenListeners(id) {
    removeOnMountBigScreen(id)
    removeOnMountBigScreenReverse(id)
}

function onSmallScreen() {
    for (const element of onMountBigScreenReverseQueue)
        element.reverse()

    for (const element of onMountSmallScreenQueue)
        element.onMount()
}

export function onMountSmallScreen(param) {
    onMountSmallScreenQueue.push(param)
    if (!get(bigScreen))
        param.onMount()
}

export function onMountSmallScreenReverse(param) {
    onMountSmallScreenReverseQueue.push(param)
}

export function removeOnMountSmallScreen(id) {
    onMountSmallScreenQueue = onMountSmallScreenQueue.filter((item) => item.id !== id)
}

export function removeOnMountSmallScreenReverse(id) {
    onMountSmallScreenReverseQueue = onMountSmallScreenReverseQueue.filter((item) => item.id !== id)
}

export function removeAllScreenRelated(id) {
    removeOnMountBigScreen(id)
    removeOnMountBigScreenReverse(id)
    removeOnMountSmallScreen(id)
    removeOnMountSmallScreenReverse(id)
}

export function getMediaQueryForResponsiveImage(media) {
    return `(-webkit-min-device-pixel-ratio: ${media.density - 1 + 0.01}) and (-webkit-max-device-pixel-ratio: ${media.density}) and (min-width: ${media.minWidth / 16}em) and (max-width: ${media.maxWidth / 16}em)`
}

export function getLinkForResponsiveImage(imageName, media, updatedAt, onceRatio = true) {
    let link = "/api/image" + "/" + imageName + "?density=" + media.density + "&width=" + media.photoWidth

    if (!onceRatio && media.aspectRatio) {
        link += "&ratio=" + media.aspectRatio[0] + "-" + media.aspectRatio[1]
        if (updatedAt)
            link += "&updated-at=" + updatedAt
    } else if (updatedAt)
        link += "&updated-at=" + updatedAt

    return link
}