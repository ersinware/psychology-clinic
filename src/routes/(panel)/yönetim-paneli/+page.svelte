<script>
    import {browser} from "$app/environment";
    import {page} from "$app/stores";
    import SmallComponent from "$lib/components/common/SmallComponent.svelte";
    import RemoveArticleWarningModal from "$lib/components/panel/homepage/RemoveArticleWarningModal.svelte";
    import {ARTICLE_COLORS} from "$lib/js/client/common/constants.client.common.js";
    import {
        DURATION_TRANSITION_AFTER_CONTENT_CHANGED,
        TRANSITION_PAGE,
    } from "$lib/js/client/common/constants.transitions.client.common.js";
    import {isSvg, onLinkClick,} from "$lib/js/client/common/util.client.common.js";
    import {openModal} from "$lib/js/client/common/util.modals.client.common.js";
    import {
        getLinkForResponsiveImage,
        getMediaQueryForResponsiveImage,
    } from "$lib/js/client/common/util.responsive.client.common.js";
    import {showErrorSnackbar, showPositiveSnackbar,} from "$lib/js/client/common/util.snackbars.client.common.js";
    import {EVENT_ARTICLE_REMOVED} from "$lib/js/client/panel/constants.client.panel.js";
    import {ARTICLE_IMAGE_MEDIA_DATA} from "$lib/js/common/constants.media.data.common.js";
    import {onDestroy, onMount} from "svelte";
    import {flip} from "svelte/animate";
    import {cubicInOut} from "svelte/easing";
    import {fade, fly} from "svelte/transition";
    import {getDashedString, waitFor} from "$lib/js/common/util.common.js";

    export let data;

    for (let i = 0; i < data.articles?.length; i++) {
        data.articles[i].svg = isSvg(data.articles[i].imageName);

        data.articles[i].backgroundColor =
            ARTICLE_COLORS[i % ARTICLE_COLORS.length];

        if (i > 3) data.articles[i].lazyImage = true;
    }

    onMount(_onMount);

    if (browser) onDestroy(_onDestroy);

    function _onMount() {
        window.addEventListener(EVENT_ARTICLE_REMOVED, onArticleRemoved);
        handleSearchParam()
    }

    async function handleSearchParam() {
        await waitFor(1000);
        switch (decodeURI($page.url.search.substring(1))) {
            case 'oturumunuz-zaten-açık':
                showErrorSnackbar("Oturumunuz zaten açık.");
                break
        }
    }

    function _onDestroy() {
        window.removeEventListener(EVENT_ARTICLE_REMOVED, onArticleRemoved);
    }

    function onRemoveClick(article) {
        openModal({
            component: RemoveArticleWarningModal,
            props: {id: article.id, title: article.title},
        });
    }

    async function onArticleRemoved(event) {
        data.articles = data.articles.filter(
            (article) => article.id !== event.detail,
        );

        await waitFor(DURATION_TRANSITION_AFTER_CONTENT_CHANGED);

        showPositiveSnackbar("Makaleniz başarıyla silindi.");
    }
</script>

<svelte:head>
    {#if data.articles.length}
        {#each new Array(4) as _, index}
            {#if index < data.articles.length}
                {@const article = data.articles[index]}
                {@const svg = isSvg(article.imageName)}

                {#if svg}
                    <link
                            rel="preload"
                            href={`/api/image/${article.imageName}?updated-at=${article.imageUpdatedAt}`}
                            as="image"
                            type="image/svg+xml"
                            fetchpriority="high"
                    />
                {:else}
                    {#each ARTICLE_IMAGE_MEDIA_DATA as media}
                        <link
                                rel="preload"
                                href={getLinkForResponsiveImage(
                                article.imageName,
                                media,
                                article.imageUpdatedAt,
                            )}
                                as="image"
                                type={"image/webp"}
                                media={getMediaQueryForResponsiveImage(media)}
                                fetchpriority="high"
                        />
                    {/each}
                {/if}
            {/if}
        {/each}
    {:else}
        <link
                rel="preload"
                href="/article.svg"
                as="image"
                type="image/svg+xml"
                fetchpriority="high"
        />
    {/if}

    <title>
        Yönetim Paneli | Uzman Klinik Psikolog Zeynep Başar | İzmir, Alsancak
    </title>
</svelte:head>

<div class="max-w-small-page m-h-auto" in:fly={TRANSITION_PAGE}>
    {#if data.articles.length}
        <section class="grid components-wrapper">
            {#each data.articles as article (article.id)}
                <div
                        animate:flip={{
                        duration: DURATION_TRANSITION_AFTER_CONTENT_CHANGED,
                        easing: cubicInOut,
                    }}
                        out:fade={{
                        duration: DURATION_TRANSITION_AFTER_CONTENT_CHANGED / 2,
                        easing: cubicInOut,
                    }}
                >
                    <SmallComponent
                            backgroundColor={article.backgroundColor}
                            title={article.title}
                            content={article.firstSentence}
                            buttonText="HEPSİNİ OKU"
                            imageId={getDashedString(article.title)}
                            imageAlt="{article.title} | Uzman Klinik Psikolog Zeynep Başar"
                            imageName={article.imageName}
                            imageUpdatedAt={article.imageUpdatedAt}
                            mediaData={article.svg
                            ? undefined
                            : ARTICLE_IMAGE_MEDIA_DATA}
                            href="/makale/{getDashedString(article.title)}"
                            lazyImage={article.lazyImage}
                            on:removeClick={() => onRemoveClick(article)}
                            limitedLines
                            forPanel
                    />
                </div>
            {/each}
        </section>
    {:else}
        <section class="flex f-column a-i-c g-v-d" in:fly={TRANSITION_PAGE}>
            <img
                    src="/article.svg"
                    alt="Hiç Makale Yok"
                    class="no-content-icon"
            />

            <h1 class="small-section-title">Hiç Makale Yok.</h1>

            <p class="article-text max-w-for-no-content t-a-c">
                Yazdığınız makaleler <br/> burada görüntülenecek.
            </p>

            <a
                    href="/yönetim-paneli/makale-ekle"
                    class="nude-button"
                    on:click={onLinkClick}>MAKALE EKLE</a
            >
        </section>
    {/if}
</div>
