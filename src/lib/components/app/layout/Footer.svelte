<script>
    import { page } from "$app/stores";
    import AppointmentModal from "$lib/components/app/modals/AppointmentModal.svelte";
    import ContactModal from "$lib/components/app/modals/contact/ContactModal.svelte";
    import { TRANSITION_PAGE } from "$lib/js/client/common/constants.transitions.client.common";
    import {
        onLinkClick,
        onLinkClickOnNewTab,
        performRippleEffectAndWait,
        performRippleEffectForButtonAndWait,
    } from "$lib/js/client/common/util.client.common";
    import { openModal } from "$lib/js/client/common/util.modals.client.common.js";
    import { fly } from "svelte/transition";

    async function onAppointmentClick(event) {
        await performRippleEffectForButtonAndWait(event);

        openModal({ component: AppointmentModal, addToBackstack: true });
    }

    async function onContactFormClick(event) {
        await performRippleEffectAndWait(event);

        openModal({ component: ContactModal, addToBackstack: true });
    }
</script>

{#key $page.url.pathname}
    <footer
        class="page-p-t p-h-d secondary-background-color o-hidden big-screen-page-p-b small-screen-p-b-for-bottom-bar-for-page"
        in:fly={TRANSITION_PAGE}
    >
        <div
            id="footer-content"
            class="grid m-h-auto big-screen-page-gap small-screen-j-i-c"
        >
            <article class="p-r flex f-column f-s-b g-2">
                <div class="grid g-1dot5 small-screen-t-a-c">
                    <p id="hello-text" class="article-text f-w-500">
                        Merhaba, ben Zeynep Başar.
                    </p>

                    <p
                        id="description"
                        class="small-article-text secondary-text-color small-screen-t-a-c"
                    >
                        Uzman Klinik Psikolog olarak, İzmir, Alsancak'taki
                        kliniğimde çeşitli terapi yöntemleriyle bireylerin daha
                        iyi oluş halini desteklemek ve kendilerini daha iyi
                        tanımalarına yardımcı olmak için çalışıyorum. Psikolojik
                        destek ve danışmanlık hizmetlerim hakkında bilgi almak
                        ve kişisel ihtiyaçlarınıza uygun terapi planı oluşturmak
                        için benimle iletişime geçebilirsiniz.
                    </p>
                </div>

                <button
                    class="button small-button small-screen-m-h-auto"
                    on:click={onAppointmentClick}>RANDEVU AL</button
                >
            </article>

            <div class="v-divider for-big-screen" />

            <article class="flex f-column g-2">
                <article class="flex g-1">
                    <svg
                        style:margin-top=".1rem"
                        class="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                    >
                        <path
                            d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                        />
                    </svg>

                    <address>
                        <p
                            class="small-article-text secondary-text-color"
                        >
                            Mimar Sinan Mahallesi
                        </p>

                        <p
                            class="small-article-text secondary-text-color"
                        >
                            Ziya Gökalp Bulvarı
                        </p>

                        <p
                            class="small-article-text secondary-text-color"
                        >
                            No: 25, Daire No: 4
                        </p>
                        
                        <p
                            class="small-article-text secondary-text-color"
                        >
                            Alsancak, İzmir
                        </p>
                    </address>
                </article>

                <article class="flex a-i-c g-1">
                    <svg
                        style:margin-top=".125rem"
                        class="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <path
                            d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                        />
                    </svg>

                    <a
                        href="tel:+905304479020"
                        rel="nofollow"
                        class="clickable-contact-item-text small-article-text secondary-text-color italic"
                        on:click={onLinkClickOnNewTab}
                    >
                        +90 530 447 90 20
                    </a>
                </article>

                <div class="grid g-1">
                    <article class="flex a-i-c g-1">
                        <svg
                            class="icon"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M11.9962 0.0078125C8.73824 0.0078125 8.32971 0.021622 7.05019 0.080003C5.77333 0.138241 4.90129 0.341051 4.13824 0.637622C3.34938 0.944146 2.68038 1.35434 2.01343 2.02124C1.34652 2.68819 0.936333 3.35719 0.629809 4.14605C0.333238 4.9091 0.130429 5.78115 0.0721905 7.058C0.0138095 8.33753 0 8.74605 0 12.0041C0 15.262 0.0138095 15.6705 0.0721905 16.9501C0.130429 18.2269 0.333238 19.099 0.629809 19.862C0.936333 20.6509 1.34652 21.3199 2.01343 21.9868C2.68038 22.6537 3.34938 23.0639 4.13824 23.3705C4.90129 23.667 5.77333 23.8698 7.05019 23.9281C8.32971 23.9864 8.73824 24.0002 11.9962 24.0002C15.2542 24.0002 15.6627 23.9864 16.9422 23.9281C18.2191 23.8698 19.0911 23.667 19.8542 23.3705C20.643 23.0639 21.312 22.6537 21.979 21.9868C22.6459 21.3199 23.0561 20.6509 23.3627 19.862C23.6592 19.099 23.862 18.2269 23.9202 16.9501C23.9786 15.6705 23.9924 15.262 23.9924 12.0041C23.9924 8.74605 23.9786 8.33753 23.9202 7.058C23.862 5.78115 23.6592 4.9091 23.3627 4.14605C23.0561 3.35719 22.6459 2.68819 21.979 2.02124C21.312 1.35434 20.643 0.944146 19.8542 0.637622C19.0911 0.341051 18.2191 0.138241 16.9422 0.080003C15.6627 0.021622 15.2542 0.0078125 11.9962 0.0078125ZM7.99748 12.0041C7.99748 14.2125 9.78776 16.0028 11.9962 16.0028C14.2047 16.0028 15.995 14.2125 15.995 12.0041C15.995 9.79557 14.2047 8.00529 11.9962 8.00529C9.78776 8.00529 7.99748 9.79557 7.99748 12.0041ZM5.836 12.0041C5.836 8.60181 8.594 5.84381 11.9962 5.84381C15.3984 5.84381 18.1564 8.60181 18.1564 12.0041C18.1564 15.4062 15.3984 18.1642 11.9962 18.1642C8.594 18.1642 5.836 15.4062 5.836 12.0041ZM18.3998 7.03996C19.1949 7.03996 19.8394 6.39548 19.8394 5.60043C19.8394 4.80538 19.1949 4.16086 18.3998 4.16086C17.6048 4.16086 16.9603 4.80538 16.9603 5.60043C16.9603 6.39548 17.6048 7.03996 18.3998 7.03996Z"
                            />
                        </svg>

                        <a
                            href="https://www.instagram.com/psk.zeynepbasar"
                            rel="nofollow"
                            class="clickable-contact-item-text small-article-text secondary-text-color italic"
                            on:click={onLinkClickOnNewTab}
                        >
                            psk.zeynepbasar
                        </a>
                    </article>

                    <article class="flex g-1">
                        <svg
                            style:margin-top=".125rem"
                            class="icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path
                                d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                            />
                        </svg>

                        <div>
                            <a
                                href="mailto:psk.zeynepbasar@gmail.com"
                                rel="nofollow"
                                class="clickable-contact-item-text small-article-text secondary-text-color italic"
                                on:click={onLinkClickOnNewTab}
                                >psk.zeynepbasar@gmail.com</a
                            >

                            <button
                                class="link-button italic"
                                on:click={onContactFormClick}
                            >
                                İletişim Formu
                            </button>
                        </div>
                    </article>
                </div>
            </article>

            <article
                id="footer-pages"
                class="flex f-column g-dot5 small-screen-t-a-c"
            >
                <p class="smaller-t-hint unimportant-text-color">
                    SİTE HARİTASI
                </p>
                <a href="/" class="link-button" on:click={onLinkClick}
                    >Anasayfa</a
                >
                <a href="/makaleler" class="link-button" on:click={onLinkClick}
                    >Makaleler</a
                >
                <a href="/hakkımda" class="link-button" on:click={onLinkClick}
                    >Hakkımda</a
                >
                <a href="/iletişim" class="link-button" on:click={onLinkClick}
                    >İletişim</a
                >
            </article>
        </div>
    </footer>
{/key}

<style>
    #hello-text {
        letter-spacing: 0.01rem;
    }

    #description {
        line-height: 1.3rem;
    }

    .icon {
        width: 1.5rem;
        min-width: 1.5rem;
        height: 1.4rem;

        fill: var(--accent-color);
    }

    .small-article-text,
    .link-button {
        line-height: 1.25rem;
    }

    @media (min-width: 65.001em) {
        #footer-content {
            grid-template-columns: 6fr auto 2fr 1fr;
            max-width: var(--footer-max-width);
        }

        #footer-pages {
            width: 6.5rem;
            text-align: right;
        }

        .smaller-t-hint {
            margin-top: 0.1rem;
            margin-left: -1.6rem;
            margin-bottom: 1.25rem;
        }
    }

    @media (max-width: 65em) {
        #footer-content {
            max-width: calc(var(--max-w-phone) - var(--main-h-padding) * 2);
            gap: calc(var(--main-v-padding) * 2.5);
        }

        .smaller-t-hint {
            margin-top: 0.25rem;
            margin-bottom: 0.5rem;
        }
    }
</style>
