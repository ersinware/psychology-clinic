<script>
    import { getStore, performRippleEffectAndWait } from '$lib/js/client/common/util.client.common'
    import { closeSnackbar } from '$lib/js/client/common/util.snackbars.client.common'
    import { cubicInOut } from 'svelte/easing'
    import { fly } from 'svelte/transition'

    export let id, content, actions

    const bigScreen = getStore('bigScreen')

    async function onActionClick(event, action) {
        await performRippleEffectAndWait(event)

        closeSnackbar(id)
        action()
    }
</script>

<article
    class="wrapper flex a-i-c g-1dot5 b-r-d"
    in:fly={{ y: $bigScreen ? '.5rem' : '-.5rem', easing: cubicInOut }}
    out:fly={{ y: $bigScreen ? '.5rem' : '-.5rem', easing: cubicInOut }}
>
    <div class="content f-w-600 t-a-c">{content}</div>

    {#if actions}
        <article class="v-divider h-100" />

        <section class="actions flex g-1dot25">
            {#each actions as { name, action, positive }}
                <button
                    class="nude-button small-button"
                    class:positive
                    on:click={(event) => onActionClick(event, action)}
                >
                    {name}
                </button>
            {/each}
        </section>
    {/if}
</article>

<style>
    .wrapper {
        padding: 0.5rem 1.5rem;

        background-color: var(--snackbar-background-color, var(--positive-color));
    }

    .content {
        line-height: 1rem;

        color: var(--content-color, white);

        font-size: 0.75rem;
        letter-spacing: 0.0125rem;
    }

    .v-divider {
        height: 0.75rem;
        background-color: var(--content-divider-color);
    }

    .nude-button {
        pointer-events: painted !important;
        color: var(--negative-button-color, white);
        letter-spacing: 0.1rem;
        margin-bottom: -0.1rem;
        font-size: .725rem;
    }

    .positive {
        color: var(--positive-button-color, white);
    }

    @media (hover: hover) {
        .nude-button {
            color: var(--negative-button-color, white) !important;
        }

        .nude-button.positive {
            color: var(--positive-button-color, white) !important;
        }
    }
</style>
