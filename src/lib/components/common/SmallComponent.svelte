<script>
    import {
        onLinkClick,
        performRippleEffectAndWait,
    } from "$lib/js/client/common/util.client.common";
    import {
        getLinkForResponsiveImage,
        getMediaQueryForResponsiveImage,
    } from "$lib/js/client/common/util.responsive.client.common";
    import { createEventDispatcher } from "svelte";
    import LazyImage from "./LazyImage.svelte";
    import {getDashedString} from "$lib/js/common/util.common.js";

    export let backgroundColor,
        title,
        content,
        href,
        buttonText,
        lazyImage,
        imageId,
        imageAlt,
        imageName,
        mediaData,
        imageUpdatedAt,
        limitedLines,
        staticImage,
        forPanel;

    const dispatch = createEventDispatcher();

    async function onClick(event) {
        await performRippleEffectAndWait(event);

        dispatch("click");
    }

    async function onRemoveClick(event) {
        await performRippleEffectAndWait(event);

        dispatch("removeClick");
    }
</script>

<article
    class="grid-component b-box grid h-100 b-r-d"
    style:background-color={backgroundColor}
>
    <article class="component-image-wrapper w-100">
        {#if lazyImage}
            <LazyImage
                id={imageId}
                alt={imageAlt}
                classes="grid-component-image w-100 b-r-d"
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
                    class="grid-component-image w-100 b-r-d"
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
                class="grid-component-image w-100 b-r-d"
            />
        {/if}
    </article>

    <div class="flex f-column g-1dot5">
        <div class="grid-component-texts-wrapper flex f-column g-1dot5">
            <h3
                class="article-title {limitedLines
                    ? 'max-two-lines o-hidden'
                    : ''}"
            >
                {title}
            </h3>

            <p
                class="grid-component-text small-article-text {limitedLines
                    ? 'max-three-lines o-hidden'
                    : ''}"
            >
                {content}
            </p>
        </div>

        {#if forPanel}
            <div class="panel-buttons-wrapper flex g-1dot5">
                <button
                    class="nude-button small-button nude-button-negative-unimportant"
                    on:click={onRemoveClick}
                >
                    KALDIR
                </button>

                <a
                    href="/yönetim-paneli/makaleyi-düzenle/{getDashedString(
                        title,
                    )}"
                    class="nude-button small-button"
                    on:click={onLinkClick}
                >
                    DÜZENLE
                </a>
            </div>
        {:else if href}
            <a {href} class="nude-button small-button" on:click={onLinkClick}>
                {buttonText}
            </a>
        {:else}
            <button class="nude-button small-button" on:click={onClick}>
                {buttonText}
            </button>
        {/if}
    </div>
</article>

<style>
    .grid-component {
        grid-template-rows: auto 1fr;
        gap: calc(var(--main-v-padding) / 2);
        padding: calc(var(--main-v-padding) * 1.25);
    }

    @media (min-width: 50.751em) {
        .grid-component-texts-wrapper {
            height: 100%;
        }
    }

    @media (max-width: 50.75em) {
        .grid-component {
            gap: calc(var(--main-v-padding) / 2);
        }

        .grid-component-texts-wrapper {
            text-align: center;
        }

        .panel-buttons-wrapper {
            justify-content: center;
        }

        :not(.panel-buttons-wrapper) > a,
        :not(.panel-buttons-wrapper) > button,
        .grid-component-text {
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
