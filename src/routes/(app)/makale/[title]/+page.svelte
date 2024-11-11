<script>
    import { page } from "$app/stores";
    import SmallComponent from "$lib/components/common/SmallComponent.svelte";
    import { ARTICLE_COLORS } from "$lib/js/client/common/constants.client.common.js";
    import { TRANSITION_PAGE } from "$lib/js/client/common/constants.transitions.client.common.js";
    import {
        getStore, isSvg,
        onLinkClick,
        performRippleEffectAndWait,
    } from "$lib/js/client/common/util.client.common.js";
    import {
        getLinkForResponsiveImage,
        getMediaQueryForResponsiveImage,
    } from "$lib/js/client/common/util.responsive.client.common.js";
    import {
        ARTICLE_IMAGE_MEDIA_DATA,
        PAGE_ARTICLE_IMAGE_MEDIA_DATA,
    } from "$lib/js/common/constants.media.data.common.js";
    import { fly } from "svelte/transition";
    import {formatDateToISOWithOffset, getDashedString} from "$lib/js/common/util.common.js";

    export let data;

    const bigScreen = getStore("bigScreen");

    for (const article of data.similarArticles)
        article.svg = isSvg(article.imageName);

    async function onContinueToReadClick(event) {
        await performRippleEffectAndWait(event);

        if ($bigScreen)
            window.scrollTo({
                top:
                    document
                        .getElementById("article-content")
                        .getBoundingClientRect().top +
                    window.scrollY -
                    document.querySelector("#header-desktop").clientHeight,
                behavior: "smooth",
            });
        else
            document
                .getElementById("article-content")
                .scrollIntoView({ behavior: "smooth", block: "start" });
    }
</script>

<svelte:head>
    {@html `
        <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Makaleler",
                        "item": "https://zeynepbasar.com.tr/makaleler"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "${data.article.title}",
                        "item": "https://zeynepbasar.com.tr/makale/${getDashedString(data.article.title)}"
                    }
                ]
            }
        </script>
    `}

    {@html `
        <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "${data.article.title}",
                "image": [
                    "https://zeynepbasar.com.tr${(() => {
                        if (isSvg(data.article.imageName))
                            return `/api/image/${data.article.imageName}`;

                        return getLinkForResponsiveImage(
                            data.article.imageName,
                            PAGE_ARTICLE_IMAGE_MEDIA_DATA[
                                PAGE_ARTICLE_IMAGE_MEDIA_DATA.length - 1
                            ],
                            data.article.imageUpdatedAt,
                        );
                    })()}"
                ],
                "datePublished": "${formatDateToISOWithOffset(data.article.createdAt)}",
                "dateModified": "${formatDateToISOWithOffset(data.article.updatedAt)}",
                "author": [{
                    "@type": "Person",
                    "name": "Zeynep Başar",
                    "url": "https://zeynepbasar.com.tr"
                }]
            }
	    </script>
    `}

    <meta
        name="description"
        content="{data.article
            .firstSentence} | İzmir, Alsancak'taki kliniğinde hizmet veren Uzman Klinik Psikolog Zeynep Başar'ın Kaleminden."
    />

    <title
        >'{data.article.title}' | Uzman Klinik Psikolog Zeynep Başar'ın
        Kaleminden | İzmir, Alsancak</title
    >
</svelte:head>

<div in:fly={TRANSITION_PAGE}>
    {#key $page.url.pathname}
        <section
            class="grid page-gap max-w-page m-h-auto"
            in:fly={TRANSITION_PAGE}
        >
            <section
                class="flex a-i-c big-screen-g-h-d small-screen-f-column-reverse small-screen-g-v-d"
            >
                <div
                    class="section-texts-wrapper flex f-column g-v-d big-screen-w-100"
                >
                    <div>
                        <p
                            class="smaller-t-hint t-hint-at-top unimportant-text-color"
                            style:margin-left=".1rem"
                        >
                            ZEYNEP BAŞAR'IN KALEMİNDEN
                        </p>

                        <h1 class="smaller-section-title">
                            {data.article.title}
                        </h1>
                    </div>

                    <p class="section-text break-word">
                        {data.article.firstSentence}
                    </p>

                    <button
                        class="nude-button"
                        on:click={onContinueToReadClick}
                    >
                        OKUMAYA DEVAM ET
                    </button>
                </div>

                <div class="section-image w-100 b-r-d o-hidden">
                    {#if isSvg(data.article.imageName)}
                        <img
                            class="section-image w-100"
                            src="/api/image/{data.article
                                .imageName}?updated-at={data.article
                                .imageUpdatedAt}"
                            alt={`${data.article.title} | Uzman Klinik Psikolog Zeynep Başar`}
                        />
                    {:else}
                        <picture class="d-contents">
                            {#each PAGE_ARTICLE_IMAGE_MEDIA_DATA as media}
                                <source
                                    class="d-contents"
                                    media={getMediaQueryForResponsiveImage(
                                        media,
                                    )}
                                    srcset={getLinkForResponsiveImage(
                                        getDashedString(data.article.imageName),
                                        media,
                                        data.article.imageUpdatedAt,
                                    )}
                                />
                            {/each}

                            <img
                                class="section-image w-100"
                                src="/blank.svg"
                                alt={`${data.article.title} | Uzman Klinik Psikolog Zeynep Başar`}
                            />
                        </picture>
                    {/if}
                </div>
            </section>

            <div
                id="article-content"
                class="b-box full-w page-p-v-d p-h-d secondary-background-color {!data
                    .similarArticles?.length
                    ? 'last-section'
                    : ''}"
            >
                <section class="tiptap-wrapper max-w-small-page m-h-auto">
                    {@html data.article.content}
                </section>

                {#if !data.similarArticles?.length}
                    <div
                        class="h-divider last-section-divider w-100 m-h-auto"
                    ></div>
                {/if}
            </div>

            {#if data.similarArticles?.length}
                <section class="grid g-v-d w-100 max-w-small-page m-h-auto">
                    <div id="articles-title-wrapper" class="grid g-dot5 t-a-c">
                        <h3 class="small-section-title">Benzer Makaleler</h3>
                        <a
                            href="/makaleler"
                            class="link-button m-h-auto w-max-content f-w-600"
                            on:click={onLinkClick}>Hepsini Gör</a
                        >
                    </div>

                    <div class="grid components-wrapper">
                        {#each data.similarArticles as article, index}
                            <SmallComponent
                                backgroundColor={ARTICLE_COLORS[
                                    index % ARTICLE_COLORS.length
                                ]}
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
                                lazyImage
                                limitedLines
                            />
                        {/each}
                    </div>
                </section>
            {/if}
        </section>
    {/key}
</div>
