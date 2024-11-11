<script>
    import {TRANSITION_PAGE} from '$lib/js/client/common/constants.transitions.client.common.js'
    import {fly} from 'svelte/transition'
    import NavigationApp from './NavigationApp.svelte'
</script>

<header id="header-desktop"
        class="header b-box p-f p-c-h t-0 w-100 max-w p-h-d for-big-screen"
        in:fly={TRANSITION_PAGE}>

    <div class="header-content p-r h-100">
        <NavigationApp/>
    </div>
</header>

<style>
    @media (min-width: 65.001em) {
        .header {
            z-index: 100;

            height: var(--header-height);

            backdrop-filter: blur(1rem);
        }

        .header-content {
            background-color: var(--header-background-color);
            border-bottom: 1px solid var(--divider-color);
        }
    }
</style>
