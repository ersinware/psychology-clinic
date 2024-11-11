<script>
    import TextArea from '$lib/components/common/inputs/TextArea.svelte'
    import {formatThoughts, validateThoughts} from '$lib/js/client/app/util.validations.client.app'
    import {getStore, performRippleEffectAndWait} from '$lib/js/client/common/util.client.common'
    import {closeLastModal, openModal} from '$lib/js/client/common/util.modals.client.common'
    import {onValidityChange} from '$lib/js/client/common/util.validations.client.common'
    import ContactModalTwo from "$lib/components/app/modals/contact/ContactModalTwo.svelte";
    import {capitalizeFirstLetterOnly} from "$lib/js/common/util.common.js";

    const arrFormValid = new Array(1),
        holder = getStore('holder')

    let form

    $: formValid = onValidityChange(arrFormValid)

    async function onCancel(event) {
        await performRippleEffectAndWait(event)

        closeLastModal()
    }

    async function onContinue(event) {
        await performRippleEffectAndWait(event)

        $holder.thoughts = capitalizeFirstLetterOnly(form.querySelector('#thoughts').value)
        openModal({component: ContactModalTwo, addToBackstack: true})
    }
</script>

<form class="modal-content-wrapper flex f-column a-i-c modal-g-v-d t-a-c big-screen-small-modal-content-wrapper-w"
      bind:this={form}>

    <div>
        <h2 class="modal-title">Bana Yazın</h2>
        <div class="t-hint modal-t-hint unimportant-text-color">1/3</div>
    </div>

    <p class="modal-text small-modal-text-max-w">
        İster danışmak, ister randevu almak, <br> ister sadece merhaba demek için, <br> bana yazın!
    </p>

    <TextArea
            wrapperClasses="small-modal-input-max-w"
            type="text"
            title="DÜŞÜNCELERİNİZ"
            name="thoughts"
            value={$holder.thoughts}
            tText="En az 10, en fazla 500 karakter olmalı"
            rows={12}
            format={formatThoughts}
            validate={validateThoughts}
            enterKeyHint="done"
            bind:valid={arrFormValid[0]}
    />

    <div class="flex j-c-c modal-buttons-g">
        <button type="button"
                class="nude-button modal-button nude-button-negative-unimportant"
                on:click={onCancel}>
            VAZGEÇ
        </button>

        <button type="button"
                disabled={!formValid}
                class:disabled-nude-button={!formValid}
                class="nude-button modal-button"
                on:click={onContinue}>
            DEVAM ET
        </button>
    </div>
</form>
