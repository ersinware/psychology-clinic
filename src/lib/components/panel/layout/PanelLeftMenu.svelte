<script>
    import { page } from "$app/stores";
    import Tooltip from "$lib/components/common/Tooltip.svelte";
    import { TRANSITION_PAGE } from "$lib/js/client/common/constants.transitions.client.common.js";
    import {
        onLinkClick,
        performRippleEffect,
    } from "$lib/js/client/common/util.client.common.js";
    import { fly } from "svelte/transition";
    import { onSignOutClick } from "$lib/js/client/panel/util.client.panel.js";

    const LEFT_MENU_DISTANCE_TOOLTIP = "calc(var(--left-menu-width) / 1)";
</script>

<aside
    class="left-menu-base-wrapper p-f flex f-column g-v-d page-p-v-d big-screen-o-y-scroll for-big-screen"
    in:fly={TRANSITION_PAGE}
>
    <section class="left-menu-wrapper flex f-column a-i-c b-r-d">
        <article class="left-menu-icon-wrapper">
            <Tooltip
                --tooltip-distance={LEFT_MENU_DISTANCE_TOOLTIP}
                text="Anasayfa"
                left
            >
                <a href="/yönetim-paneli" on:click={performRippleEffect}>
                    <svg
                        class="left-menu-icon"
                        class:active-left-menu-icon={decodeURI(
                            $page.url.pathname,
                        ) === "/yönetim-paneli"}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                    >
                        <path
                            d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                        />
                    </svg>
                </a>
            </Tooltip>
        </article>

        <article class="left-menu-icon-wrapper">
            <Tooltip
                --tooltip-distance={LEFT_MENU_DISTANCE_TOOLTIP}
                classes="nowrap"
                text="Makale Ekle"
                left
            >
                <a
                    href="/yönetim-paneli/makale-ekle"
                    on:click={performRippleEffect}
                >
                    <svg
                        style:width="1.55rem"
                        style:height="1.55rem"
                        class="left-menu-icon"
                        class:active-left-menu-icon={decodeURI(
                            $page.url.pathname,
                        ) === "/yönetim-paneli/makale-ekle"}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <path
                            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
                        />
                    </svg>
                </a>
            </Tooltip>
        </article>

        <article class="bottom-left-menu-icon-wrapper left-menu-icon-wrapper">
            <Tooltip
                --tooltip-distance={LEFT_MENU_DISTANCE_TOOLTIP}
                classes="nowrap"
                text="Çıkış Yap"
                left
            >
                <button on:click={onSignOutClick}>
                    <svg
                        style:height="1.45rem"
                        style:padding-left=".1rem"
                        class="left-menu-icon dangerous-left-menu-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <path
                            transform="rotate(180 256 256)"
                            d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                        />
                    </svg>
                </button>
            </Tooltip>
        </article>
    </section>
</aside>
