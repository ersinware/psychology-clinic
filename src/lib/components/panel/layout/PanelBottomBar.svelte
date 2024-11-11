<script>
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { TRANSITION_PAGE } from "$lib/js/client/common/constants.transitions.client.common";
    import { performRippleEffect } from "$lib/js/client/common/util.client.common";
    import {
        onMountSmallScreen,
        onMountSmallScreenReverse,
        removeOnMountSmallScreen,
        removeOnMountSmallScreenReverse,
    } from "$lib/js/client/common/util.responsive.client.common";
    import { onSignOutClick } from "$lib/js/client/panel/util.client.panel.js";
    import { onDestroy, onMount } from "svelte";
    import { fly } from "svelte/transition";

    const id = "bottom-bar";

    onMount(_onMount);

    if (browser) onDestroy(_onDestroy);

    function _onMount() {
        onMountSmallScreen({
            id,
            onMount: () => {
                for (const link of document.body.querySelectorAll(`#${id} a`))
                    link.addEventListener("click", onItemClick);
            },
        });

        onMountSmallScreenReverse({
            id,
            reverse: () => {
                removeEventListeners();
            },
        });
    }

    function _onDestroy() {
        removeEventListeners();
        removeOnMountSmallScreen(id);
        removeOnMountSmallScreenReverse(id);
    }

    function onItemClick(event) {
        performRippleEffect(event);
    }

    function removeEventListeners() {
        for (const link of document.body.querySelectorAll(`#${id} a`))
            link.removeEventListener("click", onItemClick);
    }
</script>

<div
    class="bottom-bar-wrapper p-f b-0 p-c-h flex j-c-c bottom-bar-soft-borders w-100 small-screen-max-w-phone for-small-screen"
    in:fly={TRANSITION_PAGE}
>
    <header
        {id}
        class="bottom-bar flex a-i-c f-s-e w-100 b-shadow bottom-bar-soft-borders small-screen-max-w-phone"
    >
        <a
            href="/yönetim-paneli"
            class="bottom-bar-item-wrapper flex f-column a-i-c j-c-c g-dot5 h-100"
            class:active-bottom-bar-item-wrapper={decodeURI(
                $page.url.pathname,
            ) === "/yönetim-paneli" ||
                decodeURI($page.url.pathname) === "/yönetim-paneli/"}
        >
            <svg
                class="bottom-bar-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
            >
                <path
                    d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                />
            </svg>

            <span class="bottom-bar-text f-w-500">Anasayfa</span>
        </a>

        <a
            href="/yönetim-paneli/makale-ekle"
            class="bottom-bar-item-wrapper flex f-column a-i-c j-c-c g-dot5 h-100"
            class:active-bottom-bar-item-wrapper={decodeURI(
                $page.url.pathname,
            ) === "/yönetim-paneli/makale-ekle" ||
                decodeURI($page.url.pathname) ===
                    "/yönetim-paneli/makale-ekle/"}
        >
            <svg
                style:height="1.55rem"
                class="bottom-bar-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <path
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
                />
            </svg>

            <span class="bottom-bar-text f-w-500 nowrap">Makale Ekle</span>
        </a>

        <button
            id="sign-out-wrapper"
            class="bottom-bar-item-wrapper flex f-column a-i-c j-c-c g-dot5 h-100"
            on:click={onSignOutClick}
        >
            <svg
                id="sign-out-icon"
                class="bottom-bar-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <path
                    transform="rotate(180 256 256)"
                    d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                />
            </svg>

            <span id="sign-out-text" class="bottom-bar-text f-w-500 nowrap"
                >Çıkış Yap</span
            >
        </button>
    </header>
</div>

<style>
    #sign-out-icon {
        fill: var(--error-color);
    }

    #sign-out-text {
        color: var(--error-color);
    }

    @media (hover: hover) {
        #sign-out-icon {
            transition: fill 0.5s ease-in-out;
        }

        #sign-out-text {
            transition: color 0.5s ease-in-out;
        }

        #sign-out-wrapper:hover #sign-out-icon {
            fill: var(--error-color-darker) !important;
        }

        #sign-out-wrapper:hover #sign-out-text {
            color: var(--error-color-darker) !important;
        }
    }
</style>
