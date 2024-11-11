<script>
    import { goto } from "$app/navigation";
    import { performRippleEffectForButtonAndWait } from "$lib/js/client/common/util.client.common";

    async function goHome(event) {
        event.preventDefault();

        const href = event.currentTarget.href;

        await performRippleEffectForButtonAndWait(event);
        goto(href, { replaceState: true });
    }
</script>

<svelte:head>
    <title
        >Sayfa Bulunamadı | Uzman Klinik Psikolog Zeynep Başar | İzmir, Alsancak</title
    >
</svelte:head>

<div class="flex f-column a-i-c j-c-c g-v-d">
    <img src="/error.svg" alt="Sayfa Bulunamadı" />

    <h1 class="small-section-title t-a-c">
        Aradığınız Sayfa <br /> Bulunamadı...
    </h1>

    <a href="/" class="button small-button" on:click={goHome}>ANASAYFA</a>
</div>

<style>
    img {
        max-width: 35rem;
    }
</style>
