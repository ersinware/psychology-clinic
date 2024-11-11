<script>
    import {
        DURATION_TRANSITION_MODAL,
        MODAL_TRANSITION_Y
    } from '$lib/js/client/common/constants.transitions.client.common'
    import { getStore } from '$lib/js/client/common/util.client.common'
    import { cubicInOut } from 'svelte/easing'
    import { fly } from 'svelte/transition'

    const openDynamicModals = getStore('openDynamicModals'),
        bigScreen = getStore('bigScreen')
</script>

{#each $openDynamicModals as modal (modal.id)}
    <div
        style={modal.modalWrapperStyle ?? ''}
        class="modal-wrapper dynamic-modal-wrapper p-f o-hidden small-screen-w-100 small-screen-max-w-phone {modal.modalWrapperClasses ??''}"
        in:fly={modal.modalTransition ?? {
            y: $bigScreen ? '-' + MODAL_TRANSITION_Y : MODAL_TRANSITION_Y,
            duration: DURATION_TRANSITION_MODAL,
            easing: cubicInOut
        }}
        out:fly={modal.modalTransition ?? {
            y: $bigScreen ? '-' + MODAL_TRANSITION_Y : MODAL_TRANSITION_Y,
            duration: DURATION_TRANSITION_MODAL,
            easing: cubicInOut
        }}
        on:introstart={modal.onIntroStart}
        on:introend={modal.onIntroEnd}
        on:outrostart={modal.onOutroStart}
        on:outroend={modal.onOutroEnd}
    >
        <svelte:component this={modal.component} {...modal.props} />
    </div>
{/each}
