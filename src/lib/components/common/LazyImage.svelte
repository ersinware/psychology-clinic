<script>
    import { browser } from "$app/environment";
    import {
        EVENT_LOAD_LAZY_IMAGE,
        LAZY_IMAGE_MODE_LOAD_DIRECTLY,
        LAZY_IMAGE_MODE_LOAD_WHEN_VISIBLE,
    } from "$lib/js/client/common/constants.client.common";
    import {
        addIntersectionObserver,
        removeIntersectionObserver,
    } from "$lib/js/client/common/util.observation.client.common";
    import {
        getLinkForResponsiveImage,
        getMediaQueryForResponsiveImage,
    } from "$lib/js/client/common/util.responsive.client.common";
    import { onDestroy, onMount } from "svelte";

    export let mode = LAZY_IMAGE_MODE_LOAD_WHEN_VISIBLE,
        style,
        classes,
        id,
        alt,
        mediaData,
        imageName,
        imageUpdatedAt,
        staticImage;

    let img, observer, loaded;

    const eventPostfix = "-" + id;

    onMount(_onMount);

    if (browser) onDestroy(_onDestroy);

    function _onMount() {
        window.addEventListener(
            EVENT_LOAD_LAZY_IMAGE + eventPostfix,
            loadImage,
        );

        if (mode === LAZY_IMAGE_MODE_LOAD_WHEN_VISIBLE)
            observer = addIntersectionObserver(img, loadImage);
    }

    function _onDestroy() {
        window.removeEventListener(
            EVENT_LOAD_LAZY_IMAGE + eventPostfix,
            loadImage,
        );

        if (observer) removeIntersectionObserver(observer);
    }

    async function loadImage() {
        _onDestroy();

        loaded = true;
    }
</script>

{#if mode === LAZY_IMAGE_MODE_LOAD_DIRECTLY || loaded}
    {#if mediaData}
        <picture class="d-contents">
            {#each mediaData as media}
                <source
                    class="d-contents"
                    media={getMediaQueryForResponsiveImage(media)}
                    srcset={getLinkForResponsiveImage(
                        imageName,
                        media,
                        imageUpdatedAt,
                    )}
                />
            {/each}

            <img
                {id}
                style={style ?? ""}
                class={classes ?? ""}
                src="/not-found.svg"
                {alt}
            />
        </picture>
    {:else}
        <img
            {id}
            style={style ?? ""}
            class={classes ?? ""}
            src={(() => {
                if (staticImage) return "/" + imageName;

                return `/api/image/${imageName + (imageUpdatedAt ? "?updated-at=" + imageUpdatedAt : "")}`;
            })()}
            {alt}
        />
    {/if}
{:else}
    <img
        {id}
        style={style ?? ""}
        class={classes ?? ""}
        src="/blank.svg"
        {alt}
        bind:this={img}
    />
{/if}
