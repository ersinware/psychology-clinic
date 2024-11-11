<script>
    import AppointmentModal from "$lib/components/app/modals/AppointmentModal.svelte";
    import ContactModal from "$lib/components/app/modals/contact/ContactModal.svelte";
    import LazyImage from "$lib/components/common/LazyImage.svelte";
    import SmallComponent from "$lib/components/common/SmallComponent.svelte";
    import {ARTICLE_COLORS} from "$lib/js/client/common/constants.client.common.js";
    import {TRANSITION_PAGE} from "$lib/js/client/common/constants.transitions.client.common.js";
    import {
        getStore, isSvg,
        onLinkClick,
        performRippleEffectForButtonAndWait,
    } from "$lib/js/client/common/util.client.common.js";
    import {openModal} from "$lib/js/client/common/util.modals.client.common.js";
    import {
        ARTICLE_IMAGE_MEDIA_DATA,
        BIG_ARTICLE_IMAGE_MEDIA_DATA,
    } from "$lib/js/common/constants.media.data.common.js";
    import {fly} from "svelte/transition";
    import BigComponent from "../../lib/components/common/BigComponent.svelte";
    import {getDashedString} from "$lib/js/common/util.common.js";

    export let data;

    const bigScreen = getStore("bigScreen");

    for (const article of data.articles)
        article.svg = isSvg(article.imageName);

    async function onMyWorksClick(event) {
        await performRippleEffectForButtonAndWait(event);

        if ($bigScreen)
            window.scrollTo({
                top:
                    document
                        .getElementById("my-works-wrapper")
                        .getBoundingClientRect().top +
                    window.scrollY -
                    document.querySelector("#header-desktop").clientHeight,
                behavior: "smooth",
            });
        else
            document
                .getElementById("my-works-wrapper")
                .scrollIntoView({behavior: "smooth", block: "start"});
    }

    function onAppointmentClick() {
        openModal({component: AppointmentModal, addToBackstack: true});
    }

    async function onWriteMeClick(event) {
        await performRippleEffectForButtonAndWait(event);

        openModal({component: ContactModal, addToBackstack: true});
    }
</script>

<svelte:head>
    {@html `
       <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Zeynep Başar'ın Kliniği",
                "image": "https://zeynepbasar.com.tr/api/image/klinik-fotoğrafı.webp?send-biggest=true",
                "telephone": "+905304479020",
                "email": "psk.zeynepbasar@gmail.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Mimar Sinan Mahallesi, Ziya Gökalp Bulvarı, No: 25, Daire No: 4",
                    "addressLocality": "Alsancak",
                    "addressRegion": "İzmir",
                    "addressCountry": "TR"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 38.43538626213312,
                    "longitude":27.147094813494363
                },
                "url": "https://zeynepbasar.com.tr",
                "openingHours": [
                    "Mo-Fr 10:00-19:00",
                    "Sa 10:00-15:00"
                ],
                "description": "Uzman Klinik Psikolog Zeynep Başar, bireylerin ruhsal sağlığını desteklemek ve iyi oluş halini arttırmak amacıyla, kişiye özel terapi ve danışmanlık hizmetleri sunmaktadır.",
                "sameAs": [
                    "https://www.instagram.com/psk.zeynepbasar"
                ]
            }
        </script>
    `}

    <link
            rel="preload"
            href="/happy-people.svg"
            as="image"
            type="image/svg+xml"
            fetchpriority="high"
    />

    <meta
            name="description"
            content="Merhaba, ben Uzman Klinik Psikolog Zeynep Başar. İzmir, Alsancak'taki kliniğimde bireylerin zorluklarla başa çıkmalarına ve yaşamlarına yeni bir yön vermelerine yardımcı oluyorum. Sizi dinlemek, anlamak ve desteklemek için buradayım.        "
    />

    <title>Uzman Klinik Psikolog Zeynep Başar | İzmir, Alsancak</title>
</svelte:head>

<div class="wrapper grid page-gap max-w-page m-h-auto" in:fly={TRANSITION_PAGE}>
    <section
            class="flex a-i-c big-screen-g-h-d small-screen-f-column-reverse small-screen-g-v-d"
    >
        <div
                class="section-texts-wrapper flex f-column g-v-d big-screen-w-100 small-screen-t-a-c"
        >
            <div>
                <p
                        class="smaller-t-hint t-hint-at-top unimportant-text-color"
                        style:margin-left=".1rem"
                >
                    ZEYNEP BAŞAR, KLİNİK PSİKOLOG
                </p>

                <h1 class="smaller-section-title">
                    İzmir'deki <br/> Danışmanınız.
                </h1>
            </div>

            <p class="section-text break-word">
                Merhaba ben Klinik Psikolog, Zeynep Başar. Eğitim ve çalışma
                hayatım boyunca her yaştan danışan ile süpervizyonlar alarak
                çalışma imkanı buldum. Yoğunluklu olarak yetişkinlerle
                psikanalitik/psikodinamik yönelimli olarak İzmir’de kendi
                ofisimde yüz yüze ve online olarak çalışmaktayım. Terapide
                birlikte yaşamın getirdiği zorluklarla başa çıkmanıza,
                ilişkilerinizi iyileştirmenize yardımcı olmak için çalışıyoruz.
            </p>

            <button
                    class="button small-button small-screen-m-h-auto"
                    on:click={onMyWorksClick}>ÇALIŞMALARIM
            </button
            >
        </div>

        <div class="section-image w-100 b-r-d o-hidden">
            <img
                    class="section-image w-100"
                    src="/happy-people.svg"
                    alt="Mutlu İnsanlar | Uzman Klinik Psikolog Zeynep Başar"
            />
        </div>
    </section>

    <div
            id="my-works-wrapper"
            class="b-box full-w page-p-v-d p-h-d secondary-background-color"
    >
        <section class="grid g-v-d w-100 max-w-small-page m-h-auto">
            <h2 id="my-works-title" class="smaller-section-title t-a-c">
                Hakkında Danışmak <br/> İstiyorum...
            </h2>

            <BigComponent
                    backgroundColor={ARTICLE_COLORS[0]}
                    title="Depresyon"
                    content="Depresyonla mücadele eden bireylerin geçmişleriyle bağlantı kurarak kendilerini ve duygularını daha iyi tanımaları ve hayatlarına yeni kaynaklar katmaları için çalışıyorum."
                    buttonText="RANDEVU ALIN"
                    imageId="depression"
                    imageAlt="Depresyon | Uzman Klinik Psikolog Zeynep Başar"
                    imageName="depression.svg"
                    on:click={onAppointmentClick}
                    framedButton
                    lazyImage
                    staticImage
            />

            <div class="grid components-wrapper">
                <SmallComponent
                        backgroundColor={ARTICLE_COLORS[1]}
                        title="Kaygı Bozukluğu"
                        content="Şiddetli kaygı duygusuyla mücadele eden bireylerin kaygıyla baş etme becerilerini yükseltmeye yönelik çalışmalar yürütüyorum."
                        buttonText="RANDEVU ALIN"
                        imageId="anxiety"
                        imageAlt="Kaygı Bozukluğu | Uzman Klinik Psikolog Zeynep Başar"
                        imageName="anxiety.svg"
                        on:click={onAppointmentClick}
                        lazyImage
                        staticImage
                />

                <SmallComponent
                        backgroundColor={ARTICLE_COLORS[2]}
                        title="İlişkiler"
                        content="Hayatındaki ilişkilerini daha iyi anlamak, düzenlemek, iyileştirmek, güçlendirmek ya da sınırlandırmak isteyen danışanlarla çalışıyoruz. "
                        buttonText="RANDEVU ALIN"
                        imageId="relationships"
                        imageAlt="İlişkiler | Uzman Klinik Psikolog Zeynep Başar"
                        imageName="relationship.svg"
                        on:click={onAppointmentClick}
                        lazyImage
                        staticImage
                />

                <SmallComponent
                        backgroundColor={ARTICLE_COLORS[3]}
                        title="Öz Güven, Öz Değer"
                        content="Öz güven ya da öz değer problemleri yaşayan danışanlarla özlerini tanımalarını sağlayarak bu duyguların artmasına yönelik çalışıyorum."
                        buttonText="RANDEVU ALIN"
                        imageId="self-confidence"
                        imageAlt="Özgüven, Özdeğer | Uzman Klinik Psikolog Zeynep Başar"
                        imageName="self-confidence.svg"
                        on:click={onAppointmentClick}
                        lazyImage
                        staticImage
                />

                <SmallComponent
                        backgroundColor={ARTICLE_COLORS[4]}
                        title="Diğer Konular"
                        content="Kayıp ve yas danışmanlığı, Ailevi Sorunlar, Değersizlik-Yetersizlik Hisleri, Suçluluk ve Utanç Duyguları, Travma Yaşantıları, Öfke Sorunu, Psikolojik Kökenli Bedensel Rahatsızlıklar, Geçmişe Dair Halledilemeyen Meseleler ile ilgili danışmanlık hizmeti vermekteyim. "
                        buttonText="RANDEVU ALIN"
                        imageId="other-issues"
                        imageAlt="Diğer Konular | Uzman Klinik Psikolog Zeynep Başar"
                        imageName="other-issues.svg"
                        on:click={onAppointmentClick}
                        lazyImage
                        staticImage
                />
            </div>
        </section>
    </div>

    {#if data.articles?.length}
        <section class="grid g-v-d w-100 max-w-small-page m-h-auto">
            <div id="articles-title-wrapper" class="grid g-dot5 t-a-c">
                <h2 class="smaller-section-title">Makaleler</h2>

                <a
                        href="/makaleler"
                        class="link-button w-max-content m-h-auto f-w-600"
                        on:click={onLinkClick}>Hepsini Gör</a
                >
            </div>

            <BigComponent
                    backgroundColor={ARTICLE_COLORS[0]}
                    title={data.articles[0].title}
                    content={data.articles[0].firstSentence}
                    buttonText="HEPSİNİ OKU"
                    imageId={getDashedString(data.articles[0].title)}
                    imageAlt={`${data.articles[0].title} | Uzman Klinik Psikolog Zeynep Başar`}
                    imageName={data.articles[0].imageName}
                    imageUpdatedAt={data.articles[0].imageUpdatedAt}
                    mediaData={data.articles[0].svg
                    ? undefined
                    : BIG_ARTICLE_IMAGE_MEDIA_DATA}
                    href="/makale/{getDashedString(data.articles[0].title)}"
                    framedButton
                    lazyImage
                    limitedLines
            />

            {#if data.articles.length > 1}
                <div class="grid components-wrapper">
                    {#each data.articles as article, index}
                        {#if index > 0}
                            <SmallComponent
                                    backgroundColor={ARTICLE_COLORS[index]}
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
                        {/if}
                    {/each}
                </div>
            {/if}
        </section>
    {/if}

    <div
            class={data.articles?.length
            ? "last-section b-box full-w page-p-v-d p-h-d secondary-background-color"
            : "dump"}
    >
        <section class="flex f-column a-i-c w-100 max-w-small-page m-h-auto">
            <LazyImage
                    id="contact-me-image"
                    alt="Bana Ulaşın | Uzman Klinik Psikolog Zeynep Başar"
                    classes="section-image w-100"
                    imageName="contact-me.svg"
                    staticImage
            />

            <div class="flex f-column a-i-c g-v-d t-a-c">
                <h2 class="smaller-section-title">Yazmaktan Çekinmeyin.</h2>

                <p id="contact-text" class="section-text">
                    Sorularınızı veya destek taleplerinizi bana iletmekten
                    çekinmeyin. Her zaman size yardımcı olmak için buradayım ve
                    sizinle iletişim kurmaktan memnuniyet duyarım. Size nasıl
                    yardımcı olabileceğimi öğrenmek için mesajınızı bekliyorum.
                </p>

                <button class="button small-button" on:click={onWriteMeClick}
                >BANA YAZIN
                </button
                >
            </div>
        </section>

        {#if data.articles?.length}
            <div class="h-divider last-section-divider w-100 m-h-auto"></div>
        {/if}
    </div>
</div>

<style>
    #my-works-title {
        margin-bottom: calc(var(--main-v-padding) / 2);
    }

    #contact-text {
        max-width: 27.5rem;
    }

    @media (max-width: 65em) {
        .t-hint-at-top {
            margin-top: 1rem;
        }
    }
</style>
