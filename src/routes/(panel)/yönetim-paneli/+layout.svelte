<script>
    import "$lib/css/panel/project.global.panel.css";
    import "$lib/css/panel/global.left.menu.big.screen.panel.css";
    import PanelLeftMenu from "$lib/components/panel/layout/PanelLeftMenu.svelte";
    import { TRANSITION_PAGE } from "$lib/js/client/common/constants.transitions.client.common.js";
    import { fly } from "svelte/transition";
    import PanelBottomBar from "$lib/components/panel/layout/PanelBottomBar.svelte";
    import { getStore } from "$lib/js/client/common/util.client.common.js";

    export let data;

    const session = getStore("session");

    $: $session = data.session;
</script>

<svelte:head>
    <meta name="robots" content="noindex" />
</svelte:head>

<PanelLeftMenu />

<div
    class="b-box w-100vw wrapper-with-left-menu page-p-t big-screen-page-p-b small-screen-page-p-t small-screen-p-h-d small-screen-p-b-for-bottom-bar-for-page"
    in:fly={TRANSITION_PAGE}
>
    <main class="max-w-page m-h-auto">
        <slot />
    </main>
</div>

<PanelBottomBar />
