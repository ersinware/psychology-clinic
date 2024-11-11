<script>
    import { browser } from '$app/environment'
    import { getStore, randomID } from '$lib/js/client/common/util.client.common'
    import {
        onMountHoverable,
        onMountHoverableReverse,
        removeOnHoverable,
        removeOnHoverableReverse
    } from '$lib/js/client/common/util.responsive.client.common'
    import { onDestroy, onMount } from 'svelte'
    import { cubicInOut } from 'svelte/easing'
    import { fly } from 'svelte/transition'

    export let wrapperStyle, classes, tooltipStyle, text, visible, bottom, left, manual, dontCloseOnHover

    let wrapper

    const id = randomID(),
        hoverable = getStore('hoverable'),
        touchable = getStore('touchable'),
        transition = left
            ? { x: '.25rem', easing: cubicInOut }
            : { y: bottom ? '.25rem' : '-.25rem', easing: cubicInOut }

    onMount(_onMount)

    if (browser) onDestroy(_onDestroy)

    function _onMount() {
        if (manual) return

        onMountHoverable({
            id,
            onMount: () => {
                wrapper.addEventListener('mouseenter', onMouseEnter)
                wrapper.addEventListener('mouseleave', onMouseLeave)
            }
        })

        onMountHoverableReverse({
            id,
            reverse: () => {
                wrapper.removeEventListener('mouseenter', onMouseEnter)
                wrapper.removeEventListener('mouseleave', onMouseLeave)
            }
        })
    }

    function _onDestroy() {
        removeOnHoverable(id)
        removeOnHoverableReverse(id)

        if (!wrapper) return

        wrapper.removeEventListener('mouseenter', onMouseEnter)
        wrapper.removeEventListener('mouseleave', onMouseLeave)
    }

    function onTooltipCreate(tooltip) {
        if ($hoverable) tooltip.addEventListener('mouseenter', onTooltipMouseEnter)
        if ($touchable) tooltip.addEventListener('touchstart', onTouchStart)
    }

    function onMouseEnter() {
        if (manual) return

        visible = true
    }

    function onMouseLeave() {
        if (manual) return

        visible = false
    }

    function onTooltipMouseEnter() {
        if (manual && dontCloseOnHover !== undefined && !dontCloseOnHover) visible = false
    }

    function onTouchStart(event) {
        visible = false

        event.preventDefault()
        event.stopPropagation()
    }
</script>

<div style={wrapperStyle ?? ''} class="wrapper p-r w-100 {classes ?? ''}" bind:this={wrapper}>
    <slot />

    {#if visible}
        <article
            style={tooltipStyle ?? ''}
            class="tooltip b-box p-a t-a-c f-w-500 pointer"
            class:bottom
            class:left
            use:onTooltipCreate
            transition:fly={transition}
        >
            {text}
        </article>
    {/if}
</div>

<style>
    .wrapper {
        display: var(--tooltip-display, block);
    }

    .tooltip {
        top: calc(var(--tooltip-distance, var(--default-tooltip-distance)) * -1);
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -100%);
        z-index: 98;

        max-width: var(--tooltip-max-width, max(100%, 17.5rem));
        width: var(--tooltip-width, unset);
        line-height: 0.725rem;

        padding: 0.5rem 1rem 0.5rem;

        color: var(--tooltip-text-color, --text-color);
        background-color: var(--tooltip-background-color, var(--tooltip-background-color-default));

        font-size: 0.675rem;
        letter-spacing: 0.0125rem;

        border-radius: calc(var(--border-radius) - 0.25rem);
        white-space: var(--tooltip-white-space, unset);

        transition:
            color 0.25s ease-in-out,
            background-color 0.25s ease-in-out;
    }

    .tooltip:after {
        content: '';

        position: absolute;
        top: calc(100% - 1px);
        left: 50%;
        z-index: 988;

        margin-left: -0.6rem;
        border-width: 0.6rem;
        border-style: solid;
        border-color: var(--tooltip-background-color, var(--tooltip-background-color-default)) transparent transparent
            transparent;

        transition: border 0.25s ease-in-out;
    }

    .bottom {
        top: unset;
        bottom: calc(var(--tooltip-distance, 1rem) * -1);
        transform: translate(-50%, 100%);
    }

    .bottom:after {
        top: unset;
        bottom: calc(100% - 1px);
        border-color: transparent transparent var(--tooltip-background-color, var(--tooltip-background-color-default))
            transparent;
    }

    .left {
        top: 50%;
        transform: translateY(-50%);
        left: var(--tooltip-distance);
    }

    .left:after {
        top: 50%;
        left: revert;
        right: calc(100% - 1px);
        transform: translateY(-50%);

        margin-left: revert;

        border-width: 0.475rem;

        border-color: transparent var(--tooltip-background-color, var(--tooltip-background-color-default)) transparent
            transparent;
    }

    @media (min-width: 65.001em) {
        .wrapper {
            --default-tooltip-distance: 1.25rem;
        }
    }

    @media (max-width: 65em) {
        .wrapper {
            --default-tooltip-distance: 1.25rem;
        }

        .tooltip {
            padding-top: 0.6rem;
            padding-bottom: calc(0.5rem + 1px);
        }
    }
</style>
