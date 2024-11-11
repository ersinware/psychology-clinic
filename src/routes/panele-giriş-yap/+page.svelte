<script>
    import Progress from "$lib/components/common/Progress.svelte";
    import {onMount} from "svelte";
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import {
        getStore,
        performRippleEffect,
        performRippleEffectAndWait
    } from "$lib/js/client/common/util.client.common.js";
    import {
        DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED,
        DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED,
        TRANSITION_PAGE
    } from "$lib/js/client/common/constants.transitions.client.common.js";
    import InputText from "$lib/components/common/inputs/InputText.svelte";
    import {onValidityChange, validateEmailAddress} from "$lib/js/client/common/util.validations.client.common.js";
    import {fly} from "svelte/transition";
    import {showErrorSnackbar, showPositiveSnackbar} from "$lib/js/client/common/util.snackbars.client.common.js";
    import {waitFor} from "$lib/js/common/util.common.js";

    const arrFormValid = new Array(2),
        session = getStore('session')

    let form, state, disable

    $: formValid = onValidityChange(arrFormValid)

    onMount(_onMount)

    function _onMount() {
        handleSearchParam()
    }

    async function handleSearchParam() {
        await waitFor(1000)
        switch (decodeURI($page.url.search.substring(1))) {
            case 'yetkisiz':
                showErrorSnackbar('Bu sayfayı görüntülemek için yetkiniz yok. Lütfen giriş yapın.')
                break
        }
    }

    async function onCancelClick(event) {
        await performRippleEffectAndWait(event)
        await goto('/', {replaceState: true, invalidateAll: true})
    }

    async function onSignInClick(event) {
        disable = true
        state = 'navigating'

        performRippleEffect(event)

        const response = await fetch('/api/user/sign-in', {
            method: 'PUT',
            body: JSON.stringify({
                email: form.querySelector('#email').value,
                password: form.querySelector('#password').value
            })
        })

        if (response.status === 200) onSuccess()
        else onError((await response.json()).error)
    }

    async function onSuccess() {
        state = 'navigated'
        await waitFor(DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED)

        await goto('/yönetim-paneli', {replaceState: true})
        await waitFor(DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED)

        $session = {authentication: 'AUTHENTICATED'}

        showPositiveSnackbar('Oturumunuz başarıyla başlatıldı.')
    }

    async function onError(error) {
        state = 'navigated'
        await waitFor(DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED)
        showErrorSnackbar(error)
        disable = false
    }

    function validatePassword(value) {
        if (!value) return false

        return value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) ?? false
    }
</script>

<svelte:head>
    <meta name="robots" content="noindex"/>

    <title>Panele Giriş Yap | Uzman Klinik Psikolog Zeynep Başar | İzmir, Alsancak</title>
</svelte:head>

<section class="wrapper flex f-column a-i-c j-c-c h-100vh p-h-d" in:fly={TRANSITION_PAGE}>
    <form class="modal-content-wrapper p-r flex f-column a-i-c modal-g-v-d t-a-c b-r-d o-hidden big-screen-small-modal-content-wrapper-w small-screen-b-box small-screen-w-100 small-screen-max-w-phone-with-padding-h"
          bind:this={form}>

        <Progress bind:state forModal/>

        <h2 class="modal-title">Tekrar Hoşgeldiniz</h2>

        <p class="modal-text small-modal-text-max-w">
            E-posta adresinizi ve şifrenizi giriniz.
        </p>

        <InputText
                wrapperClasses="small-modal-input-max-w"
                type="email"
                title="E-POSTA ADRESİNİZ"
                name="email"
                tText="xxx@xxx.com formatında olmalı"
                validate={validateEmailAddress}
                bind:valid={arrFormValid[0]}
                bind:disable
        />

        <InputText
                wrapperClasses="small-modal-input-max-w"
                type="password"
                title="ŞİFRENİZ"
                name="password"
                tText="En az bir küçük harf, bir büyük harf, bir rakam barındırmalı ve en az 8 karakterden oluşmalı"
                validate={validatePassword}
                enterKeyHint="done"
                bind:valid={arrFormValid[1]}
                bind:disable
        />

        <div class="flex j-c-c modal-buttons-g">
            <button
                    type="button"
                    disabled={disable}
                    class:disabled-nude-button={disable}
                    class="nude-button modal-button nude-button-negative-unimportant"
                    on:click={onCancelClick}
            >
                VAZGEÇ
            </button>

            <button
                    type="button"
                    disabled={!formValid || disable}
                    class="nude-button modal-button nude-button"
                    class:disabled-nude-button={!formValid || disable}
                    on:click={onSignInClick}
            >
                GİRİŞ YAP
            </button>
        </div>
    </form>
</section>

<style>
    .modal-content-wrapper {
        --input-label-background-color: rgb(243, 243, 243);
        background-color: rgb(243, 243, 243);
    }
</style>
