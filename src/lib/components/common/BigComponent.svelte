<script>
    import { browser } from "$app/environment";
    import LazyImage from "$lib/components/common/LazyImage.svelte";
    import {
        performRippleEffectAndWait,
        performRippleEffectForButtonAndWait,
    } from "$lib/js/client/common/util.client.common";
    import { onLinkClick } from "$lib/js/client/common/util.client.common.js";
    import {
        getLinkForResponsiveImage,
        getMediaQueryForResponsiveImage,
    } from "$lib/js/client/common/util.responsive.client.common";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import {getDashedString} from "$lib/js/common/util.common.js";

    export let backgroundColor,
        title,
        content,
        href,
        framedButton,
        buttonText,
        lazyImage,
        imageId,
        imageAlt,
        imageName,
        mediaData,
        imageUpdatedAt,
        limitedLines,
        staticImage,
        framedButtonRipple = framedButton,
        mqlFramedButton;

    const dispatch = createEventDispatcher();

    onMount(_onMount);

    if (browser) onDestroy(_onDestroy);

    function _onMount() {
        if (!framedButton) return;

        mqlFramedButton = window.matchMedia("(max-width: 50.75em)");
        framedButtonRipple = !mqlFramedButton.matches;

        mqlFramedButton.addEventListener("change", onChange);
    }

    function _onDestroy() {
        if (framedButton)
            mqlFramedButton.removeEventListener("change", onChange);
    }

    function onChange(query) {
        framedButtonRipple = !query.matches;
    }

    async function onClick(event) {
        if (framedButtonRipple)
            await performRippleEffectForButtonAndWait(event);
        else await performRippleEffectAndWait(event);

        dispatch("click");
    }
</script>

<article
    class="big-grid-component flex b-r-d"
    style:background-color={backgroundColor}
>
    <article class="big-grid-component-texts-wrapper flex f-column g-1dot5">
        <h3
            class="big-grid-component-title {limitedLines
                ? 'max-two-lines o-hidden'
                : ''}"
        >
            {title}
        </h3>

        <div class="flex f-column g-1dot5">
            <p
                class="small-section-text big-component-text break-word {limitedLines
                    ? 'o-hidden big-screen-max-four-lines small-screen-max-three-lines'
                    : ''}"
            >
                {content}
            </p>

            {#if href}
                <a
                    {href}
                    class="nude-button small-button"
                    on:click={onLinkClick}
                >
                    {buttonText}
                </a>
            {:else}
                <button
                    class:button={framedButton}
                    class:framed-button={framedButton}
                    class:nude-button={!framedButton}
                    class="small-button"
                    on:click={onClick}
                >
                    {buttonText}
                </button>
            {/if}
        </div>
    </article>

    <article class="component-image-wrapper w-100">
        {#if lazyImage}
            <LazyImage
                id={imageId}
                alt={imageAlt}
                classes="big-grid-component-image w-100 b-r-d"
                {imageName}
                {mediaData}
                {imageUpdatedAt}
                {staticImage}
            />
        {:else if mediaData}
            <picture class="d-contents">
                {#each mediaData as media}
                    <source
                        class="d-contents"
                        media={getMediaQueryForResponsiveImage(media)}
                        srcset={getLinkForResponsiveImage(
                            getDashedString(imageName),
                            media,
                            imageUpdatedAt,
                        )}
                    />
                {/each}

                <img
                    class="big-grid-component-image w-100 b-r-d"
                    src="/blank.svg"
                    alt={imageAlt}
                />
            </picture>
        {:else}
            <img
                id={imageId}
                src={(() => {
                    if (staticImage) return imageName;

                    return `/api/image/${imageName + (imageUpdatedAt ? "?updated-at=" + imageUpdatedAt : "")}`;
                })()}
                alt={imageAlt}
                class="big-grid-component-image w-100 b-r-d"
            />
        {/if}
    </article>
</article>

<style>
    .big-grid-component {
        padding: calc(var(--main-v-padding) * 1.25);
    }

    @media (min-width: 50.751em) {
        .big-grid-component {
            display: flex;
            gap: var(--main-h-padding);
            align-items: center;
        }

        .big-grid-component-texts-wrapper {
            width: 100%;
            margin-bottom: calc(var(--main-v-padding) / 2);
        }

        .big-grid-component-title {
            font-size: 1.75rem;
            line-height: 2.25rem;
            letter-spacing: 0.025rem;
        }
    }

    @media (max-width: 50.75em) {
        .big-grid-component {
            display: grid;
            grid-template-areas: "image" "texts";
            gap: calc(var(--main-v-padding) / 2);
        }

        .big-grid-component-texts-wrapper {
            grid-area: texts;
            text-align: center;
        }

        .big-grid-component-title {
            line-height: 1.75rem;
            font-size: 1.4rem;
            letter-spacing: 0.025rem;
        }

        .big-component-text {
            line-height: 1.25rem;
        }

        .component-image-wrapper {
            grid-area: image;
        }

        .component-image-wrapper,
        .big-grid-component-image {
            max-width: 25rem;
            margin-left: auto;
            margin-right: auto;
        }

        a,
        button,
        .big-component-text {
            margin-left: auto;
            margin-right: auto;
        }

        .framed-button {
            color: var(--accent-color);
            background-color: transparent;

            transition: color 0.25s ease-in-out;
        }

        @media (hover: hover) {
            .framed-button:hover {
                color: var(--accent-color-darker);
                box-shadow: none;
            }
        }
    }
</style>
