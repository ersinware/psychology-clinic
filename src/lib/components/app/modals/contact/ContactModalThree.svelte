<script>
    import {browser} from "$app/environment";
    import Progress from "$lib/components/common/Progress.svelte";
    import InputText from "$lib/components/common/inputs/InputText.svelte";
    import {
        DURATION_TRANSITION_MODAL,
        DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED,
    } from "$lib/js/client/common/constants.transitions.client.common";
    import {
        getStore,
        performRippleEffect,
        performRippleEffectAndWait,
        registerInterceptionsForModal,
        unregisterInterceptionsForModal,

    } from "$lib/js/client/common/util.client.common";
    import {
        closeAllModals,
        closeLastModal,
    } from "$lib/js/client/common/util.modals.client.common";
    import {
        showErrorSnackbar,
        showPositiveSnackbar,
    } from "$lib/js/client/common/util.snackbars.client.common";
    import {
        onValidityChange,
        validateEmailAddress,
    } from "$lib/js/client/common/util.validations.client.common";
    import {onDestroy, onMount} from "svelte";
    import {waitFor} from "$lib/js/common/util.common.js";

    const id = "contact-modal-three",
        arrFormValid = new Array(2),
        holder = getStore("holder"),
        dontInterruptModal = getStore("dontInterruptModal");

    let form, state;

    $: formValid = onValidityChange(arrFormValid);

    if (browser) onDestroy(_onDestroy);

    onMount(_onMount);

    function _onMount() {
        registerInterceptionsForModal(id, intercept);
    }

    function _onDestroy() {
        unregisterInterceptionsForModal(id);
        $dontInterruptModal = false;
    }

    async function intercept(event) {
        if ($dontInterruptModal) return;

        if (event) await performRippleEffectAndWait(event);

        $holder.email = form.querySelector("#email").value;
        $holder.phone = form.querySelector("#phone").value;

        closeLastModal();
    }

    async function onCancelClick(event) {
        await performRippleEffectAndWait(event);
        closeAllModals();
    }

    async function onSendClick(event) {
        $dontInterruptModal = true;
        state = "navigating";

        performRippleEffect(event);

        const response = await fetch("/api/contact", {
            method: "PUT",
            body: JSON.stringify({
                ...$holder,
                email: form.querySelector("#email").value,
                phone: form.querySelector("#phone").value,
            }),
        });

        if (response.status === 200) onSuccess();
        else onError((await response.json())?.error);
    }

    async function onSuccess() {
        state = "navigated";
        await waitFor(DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED);

        closeAllModals();
        await waitFor(DURATION_TRANSITION_MODAL);

        showPositiveSnackbar(
            "Mesajınız başarıyla iletildi. Size geri dönüş yapacağım.",
        );
    }

    async function onError(error) {
        state = "navigated";

        await waitFor(DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED);

        showErrorSnackbar(error);

        $dontInterruptModal = false;
    }

    function formatPhoneNumber(value, newLetter) {
        const phoneNumberBreakpoints = [3, 7, 10]
        if (!/^[0-9]$/.test(newLetter))
            return {preventDefault: true}


        if (value.length > 13)
            return {preventDefault: true}

        for (const breakpoint of phoneNumberBreakpoints) {
            const newPhoneNumber = getNewPhoneNumber(value, breakpoint)

            if (newPhoneNumber) return {newValue: newPhoneNumber}
        }
    }

    function getNewPhoneNumber(value, breakpoint) {
        if (value.length > breakpoint) {
            const target = value[breakpoint]
            if (target !== " ") return value.substring(0, breakpoint) + " " + target
        }
    }

    function validatePhoneNumber(value) {
        if (value[0] !== "5") return false

        return /^[0-9 ]{13}$/.test(value)
    }
</script>

<form
        class="modal-content-wrapper flex f-column a-i-c modal-g-v-d t-a-c big-screen-small-modal-content-wrapper-w"
        bind:this={form}
>
    <Progress bind:state forModal/>

    <div>
        <h2 class="modal-title">İletişim Bilgileriniz</h2>
        <div class="t-hint modal-t-hint unimportant-text-color">3/3</div>
    </div>

    <p class="modal-text small-modal-text-max-w">
        Mesajınıza geri dönüş yapabilmem <br/> için iletişim bilgileriniz gerekli.
    </p>

    <InputText
            wrapperClasses="small-modal-input-max-w"
            type="email"
            title="E-POSTA ADRESİNİZ"
            name="email"
            value={$holder.email}
            tText="xxx@xxx.com formatında olmalı"
            validate={validateEmailAddress}
            bind:disable={$dontInterruptModal}
            bind:valid={arrFormValid[0]}
    />

    <InputText
            wrapperClasses="small-modal-input-max-w"
            type="tel"
            title="TELEFONUNUZ"
            name="phone"
            value={$holder.phone}
            tText="5xx xxx xxx xx formatında olmalı"
            format={formatPhoneNumber}
            validate={validatePhoneNumber}
            enterKeyHint="done"
            bind:valid={arrFormValid[1]}
            bind:disable={$dontInterruptModal}
            optional
    />

    <div class="flex j-c-c modal-buttons-g">
        <button
                type="button"
                disabled={$dontInterruptModal}
                class="nude-button modal-button nude-button-negative-unimportant"
                class:disabled-nude-button={$dontInterruptModal}
                on:click={onCancelClick}
        >
            VAZGEÇ
        </button>

        <button
                type="button"
                disabled={!formValid || $dontInterruptModal}
                class:disabled-nude-button={!formValid || $dontInterruptModal}
                class="nude-button modal-button nude-button"
                on:click={onSendClick}
        >
            GÖNDER
        </button>
    </div>
</form>
