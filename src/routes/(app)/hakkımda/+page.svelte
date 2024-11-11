<script>
    import LazyImage from "$lib/components/common/LazyImage.svelte";
    import { TRANSITION_PAGE } from "$lib/js/client/common/constants.transitions.client.common.js";
    import {
        getStore,
        performRippleEffectForButtonAndWait,
    } from "$lib/js/client/common/util.client.common.js";
    import { ABOUT_ME_IMAGE_MEDIA_DATA } from "$lib/js/common/constants.media.data.common";
    import { fly } from "svelte/transition";

    const bigScreen = getStore("bigScreen");

    async function onMyResumeClick(event) {
        await performRippleEffectForButtonAndWait(event);

        if ($bigScreen)
            window.scrollTo({
                top:
                    document
                        .getElementById("resume-wrapper")
                        .getBoundingClientRect().top +
                    window.scrollY -
                    document.querySelector("#header-desktop").clientHeight,
                behavior: "smooth",
            });
        else
            document
                .getElementById("resume-wrapper")
                .scrollIntoView({ behavior: "smooth", block: "start" });
    }
</script>

<svelte:head>
    <link
        rel="preload"
        href="/psychologist.svg"
        as="image"
        type="image/svg+xml"
        fetchpriority="high"
    />

    <meta
        name="description"
        content="Merhaba, ben Uzman Klinik Psikolog Zeynep Başar. Bireylerin iyi oluş halini artırmak için İzmir, Alsancak'taki kliniğimde çeşitli terapi yöntemleri sunuyorum. Bu sayfamda eğitimim, uzmanlık alanlarım ve deneyimlerim hakkında detaylı bilgiler bulabilirsiniz."
    />

    <title>
        Hakkımda | Uzman Klinik Psikolog Zeynep Başar | İzmir, Alsancak
    </title>
</svelte:head>

<div class="grid page-gap max-w-page m-h-auto" in:fly={TRANSITION_PAGE}>
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
                    UZMAN KLİNİK PSİKOLOG
                </p>

                <h1 class="smaller-section-title">
                    Merhaba, <br /> Ben Zeynep.
                </h1>
            </div>

            <p class="section-text break-word">
                Bireylerin iyi oluş halini artırmak için İzmir, Alsancak'taki
                kliniğimde çeşitli terapi yöntemleri sunuyorum. Bu sayfamda
                eğitimim, uzmanlık alanlarım ve deneyimlerim hakkında detaylı
                bilgiler bulabilirsiniz.
            </p>

            <button
                class="button small-button small-screen-m-h-auto"
                on:click={onMyResumeClick}>ÖZGEÇMİŞİM</button
            >
        </div>

        <div class="section-image w-100 b-r-d o-hidden">
            <img
                class="section-image w-100"
                src="/psychologist.svg"
                alt="Uzman Klinik Psikolog Zeynep Başar"
            />
        </div>
    </section>

    <div
        id="resume-wrapper"
        class="b-box last-section full-w page-p-v-d p-h-d secondary-background-color"
    >
        <section
            class="flex f-column a-i-c g-3 w-100 max-w-small-page m-h-auto"
        >
            <LazyImage
                id="zeynep-basar"
                alt="Uzman Klinik Psikolog Zeynep Başar"
                classes="section-image w-100 b-r-d"
                imageName="zeynep-basar.webp"
                mediaData={ABOUT_ME_IMAGE_MEDIA_DATA}
            />

            <div class="flex f-column a-i-c g-v-d">
                <h2 class="smaller-section-title">Özgeçmişim</h2>

                <p class="long-section-text section-text t-a-j">
                    Uzman Klinik Psikolog Zeynep Başar, psikoloji lisans
                    eğitimini İzmir Ekonomi Üniversitesi’nde tamamlamış,
                    ardından Boğaziçi Üniversitesi Klinik Psikoloji yüksek
                    lisans programından mezun olmuştur. Klinik stajını
                    süpervizyon eşliğinde Boğaziçi Üniversitesi Psikolojik
                    Araştırma ve Uygulama Merkezi’nde (BÜPAM) üniversite
                    öğrencileri ve çocuklarla gerçekleştirmiştir. Yüksek lisans
                    tezi kapsamında İstanbul95 projesinde gönüllü çalışmış ve
                    aynı projenin Aile Temelli Ev Ziyareti Programı ayağında
                    anne ve bebek etkileşimlerini gözlemlemiş ve ev ziyareti
                    programının anne ve bebek üzerindeki etkilerini
                    araştırmıştır.

                    <br />
                    <br />

                    Yetişkinlere psikodinamik temelli bireysel terapi hizmeti
                    vermektedir. Ek olarak, Kısa Süreli Çözüm Odaklı, Sanat ve
                    Bilişsel Davranışçı terapi eğitimleri almıştır. Çocuklarla
                    ise Deneyimsel Oyun terapisi yapmaktadır. Şu anda yetişkin,
                    ergen ve çocuklarla İzmir’deki ofisinde yüz yüze ve online
                    olarak çalışmalarına devam etmektedir.

                    <br />
                    <br />

                    <span class="small-title inline-block f-w-500"
                        >Uzmanlık Alanları</span
                    >

                    <br />

                    <span class="italic">
                        Depresyon, Kaygı Bozuklukları, Fobiler, Obsesif
                        Kompulsif Bozukluk, Kayıp ve yas danışmanlığı, İlişki
                        problemleri, İletişim Sorunları, Ailevi Sorunlar,
                        Değersizlik-Yetersizlik Hisleri, Suçluluk ve Utanç
                        Duyguları, Travma Yaşantıları, Öfke Sorunu, Psikolojik
                        Kökenli Bedensel Rahatsızlıklar, Geçmişe Dair
                        Halledilemeyen Meseleler.
                    </span>

                    <br />
                    <br />

                    <span class="small-title inline-block f-w-500"
                        >Eğitim,Sertifika ve Sunumlar</span
                    >
                    <br />
                    <span class="italic"
                        >Kısa Süreli Çözüm Odaklı Terapi Eğitimi - Yrd. Doç. Dr.
                        Nevin Dölek</span
                    >
                    <br />
                    <span class="italic"
                        >Sanat Terapisi Eğitimi - Arkabahçe Psikolojik Gelişim
                        ve Danışmanlık Merkezi</span
                    >
                    <br />
                    <span class="italic"
                        >Bilişsel Davranışçı Terapi Eğitimi - Doç. Dr. Vahdet
                        Görmez</span
                    >
                    <br />
                    <span class="italic"
                        >Çocuklarla Deneyimsel Oyun Terapisi Eğitimi - Uzm. Psk.
                        Nilüfer Devecigil</span
                    >
                    <br />
                    <span class="italic"
                        >Psikanalitik Bakışlar 11: “Gitmek mi Kalmak mı?
                        Psikanaliz ve Göç” – 2017</span
                    >
                    <br />
                    <span class="italic"
                        >Psikanalitik Bakışlar 12: “İç Dünya – Dış Gerçeklik” –
                        2018</span
                    >
                    <br />
                    <span class="italic"
                        >Psikanalitik Bakışlar 13: “Yıkıcılık ve Ölüm Dürtüsü” –
                        2019</span
                    >
                    <br />
                    <span class="italic">4. Psikoterapi Zirvesi – 2021</span>
                    <br />
                    <span class="italic"
                        >Psikoterapide Metafor Kullanımı, Mita Psikoloji – 2021</span
                    >
                    <br />
                    <span class="italic"
                        >İzmir Psikanaliz Toplantıları, İstanbul Psikanaliz
                        Derneği – 2022-2023</span
                    >
                    <br />
                    <span class="italic"
                        >İzmir Psikanaliz Toplantısı, Tekinsizlik Üzerine Vaka
                        Sunumu, İstanbul Psikanaliz Derneği – 2023</span
                    >
                    <br />
                    <span class="italic"
                        >Psikanalitik Terapi Kuramsal Eğitimi, İzmir Odağ
                        Psikanaliz ve Psikoterapi Derneği – 2023-2024</span
                    >
                </p>
            </div>
        </section>

        <div class="last-section-divider h-divider m-h-auto"></div>
    </div>
</div>

<style>
    .long-section-text {
        max-width: 39rem;
    }

    .small-title {
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
    }

    .italic {
        letter-spacing: -0.015rem;
    }
</style>
