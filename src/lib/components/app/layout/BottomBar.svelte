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
            href="/"
            class="bottom-bar-item-wrapper flex f-column a-i-c j-c-c g-dot5 h-100"
            class:active-bottom-bar-item-wrapper={$page.url.pathname === "/"}
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

            <p class="bottom-bar-text f-w-500">Anasayfa</p>
        </a>

        <a
            href="/makaleler"
            class="bottom-bar-item-wrapper flex f-column a-i-c j-c-c g-dot5 h-100"
            class:active-bottom-bar-item-wrapper={$page.url.pathname ===
                "/makaleler" || $page.url.pathname === "/makaleler/"}
        >
            <svg
                class="bottom-bar-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <path
                    d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152l0 264-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427L0 224c0-17.7 14.3-32 32-32l30.3 0c63.6 0 125.6 19.6 177.7 56zm32 264l0-264c52.1-36.4 114.1-56 177.7-56l30.3 0c17.7 0 32 14.3 32 32l0 203c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"
                />
            </svg>

            <p class="bottom-bar-text f-w-500">Makaleler</p>
        </a>

        <a
            href="/hakkımda"
            class="bottom-bar-item-wrapper flex f-column a-i-c j-c-c g-dot5 h-100"
            class:active-bottom-bar-item-wrapper={decodeURI(
                $page.url.pathname,
            ) === "/hakkımda" || decodeURI($page.url.pathname) === "/hakkımda/"}
        >
            <svg class="bottom-bar-icon" viewBox="0 0 12 13">
                <path
                    d="M9.3005371,6.5351563C8.4776001,7.4294434,7.3084106,8,6,8S3.5223999,7.4294434,2.6994629,6.5351563   C1.3145142,7.2350464,0.5,8.6131592,0.5,10.5V12h11v-1.5C11.5,8.6131592,10.6854858,7.2350464,9.3005371,6.5351563z"
                />
                <circle cx="6" cy="3.5" r="3.5" />
            </svg>

            <p class="bottom-bar-text f-w-500">Hakkımda</p>
        </a>

        <a
            href="/iletişim"
            class="bottom-bar-item-wrapper flex f-column a-i-c j-c-c g-dot5 h-100"
            class:active-bottom-bar-item-wrapper={decodeURI(
                $page.url.pathname,
            ) === "/iletişim" || decodeURI($page.url.pathname) === "/iletişim/"}
        >
            <svg
                class="bottom-bar-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
            >
                <path
                    d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152l0 270.8c0 9.8-6 18.6-15.1 22.3L416 503l0-302.6zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6l0 251.4L32.9 502.7C17.1 509 0 497.4 0 480.4L0 209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77l0 249.3L192 449.4 192 255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                />
            </svg>

            <p class="bottom-bar-text f-w-500">İletişim</p>
        </a>
    </header>
</div>
