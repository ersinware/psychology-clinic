<script>
    import InputText from "$lib/components/common/inputs/InputText.svelte";
    import {
        formatName,
        formatSurname,
        validateName,
        validateSurname,
    } from "$lib/js/client/app/util.validations.client.app";
    import {
        getStore,
        performRippleEffectAndWait,
    } from "$lib/js/client/common/util.client.common";
    import {
        closeAllModals,
        openModal,
    } from "$lib/js/client/common/util.modals.client.common";
    import { onValidityChange } from "$lib/js/client/common/util.validations.client.common";
    import ContactModalThree from "$lib/components/app/modals/contact/ContactModalThree.svelte";
    import {capitalizeFirstLetterOnly} from "$lib/js/common/util.common.js";

    const arrFormValid = new Array(2),
        holder = getStore("holder");

    let form;

    $: formValid = onValidityChange(arrFormValid);

    async function onCancelClick(event) {
        await performRippleEffectAndWait(event);

        closeAllModals();
    }

    async function onContinueClick(event) {
        await performRippleEffectAndWait(event);

        $holder.name = capitalizeFirstLetterOnly(
            form.querySelector("#name").value,
        );
        $holder.surname = capitalizeFirstLetterOnly(
            form.querySelector("#surname").value,
        );

        openModal({ component: ContactModalThree });
    }
</script>

<form
    class="modal-content-wrapper flex f-column a-i-c modal-g-v-d t-a-c big-screen-small-modal-content-wrapper-w"
    bind:this={form}
>
    <div>
        <h2 class="modal-title">Kişisel Bilgileriniz</h2>
        <div class="t-hint modal-t-hint unimportant-text-color">2/3</div>
    </div>

    <p class="modal-text small-modal-text-max-w">
        Hitap edebilmek için <br /> adınıza ihtiyacım var.
    </p>

    <InputText
        wrapperClasses="small-modal-input-max-w"
        inputClasses="t-capitalize"
        type="text"
        title="ADINIZ"
        name="name"
        value={$holder.name}
        tText="En az 2, en fazla 25 karakter olmalı"
        format={formatName}
        validate={validateName}
        bind:valid={arrFormValid[0]}
    />

    <InputText
        wrapperClasses="small-modal-input-max-w"
        inputClasses="t-capitalize"
        type="text"
        title="SOYADINIZ"
        name="surname"
        value={$holder.surname}
        tText="En az 2, en fazla 25 karakter olmalı"
        format={formatSurname}
        validate={validateSurname}
        enterKeyHint="done"
        bind:valid={arrFormValid[1]}
        optional
    />

    <div class="flex j-c-c modal-buttons-g">
        <button
            type="button"
            class="nude-button modal-button nude-button-negative-unimportant"
            on:click={onCancelClick}
        >
            VAZGEÇ
        </button>

        <button
            type="button"
            disabled={!formValid}
            class:disabled-nude-button={!formValid}
            class="nude-button modal-button nude-button"
            on:click={onContinueClick}
        >
            DEVAM ET
        </button>
    </div>
</form>