<script>
    import { browser } from "$app/environment";
    import Progress from "$lib/components/common/Progress.svelte";
    import {
        DURATION_TRANSITION_MODAL,
        DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED,
    } from "$lib/js/client/common/constants.transitions.client.common";
    import {
        getStore,
        performRippleEffect,
        performRippleEffectAndWait,

    } from "$lib/js/client/common/util.client.common";
    import { closeLastModal } from "$lib/js/client/common/util.modals.client.common";
    import { showErrorSnackbar } from "$lib/js/client/common/util.snackbars.client.common";
    import { EVENT_ARTICLE_REMOVED } from "$lib/js/client/panel/constants.client.panel.js";
    import { onDestroy } from "svelte";
    import {waitFor} from "$lib/js/common/util.common.js";

    export let id, title;

    let state,
        dontInterruptModal = getStore("dontInterruptModal");

    if (browser) onDestroy(_onDestroy);

    function _onDestroy() {
        $dontInterruptModal = false;
    }

    async function onCancel(event) {
        await performRippleEffectAndWait(event);

        closeLastModal();
    }

    async function send(event) {
        $dontInterruptModal = true;
        state = "navigating";

        performRippleEffect(event);

        const response = await fetch(
            "/yönetim-paneli/api/article/remove-article",
            {
                method: "DELETE",
                body: id,
            },
        );

        if (response.status === 200) onSuccess();
        else onError((await response.json())?.error);
    }

    async function onSuccess() {
        state = "navigated";
        await waitFor(DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED);

        closeLastModal();
        await waitFor(DURATION_TRANSITION_MODAL);

        window.dispatchEvent(
            new CustomEvent(EVENT_ARTICLE_REMOVED, { detail: id }),
        );
    }

    async function onError(error) {
        state = "navigated";
        await waitFor(DURATION_TRANSITION_MODAL_PROGRESS_BAR_NAVIGATED);

        showErrorSnackbar(error);
        $dontInterruptModal = false;
    }
</script>

<article
    class="modal-content-wrapper flex f-column a-i-c modal-g-v-d t-a-c big-screen-small-modal-content-wrapper-w"
>
    <Progress bind:state forModal />

    <h2 class="modal-title">Makale Kaldırılacak</h2>

    <p class="modal-text small-modal-text-max-w">
        '{title}' adlı makaleniz kaldırılacak.
    </p>

    <p class="modal-text small-modal-text-max-w modal-warning-text f-w-500">
        Bu işlem geri alınamaz.<br />Devam etmek istiyor musunuz?
    </p>

    <div class="flex j-c-c modal-buttons-g">
        <button
            type="button"
            disabled={$dontInterruptModal}
            class="nude-button modal-button nude-button-negative-unimportant"
            class:disabled-nude-button={$dontInterruptModal}
            on:click={onCancel}
        >
            VAZGEÇ
        </button>

        <button
            type="button"
            disabled={$dontInterruptModal}
            class:disabled-nude-button={$dontInterruptModal}
            class="nude-button modal-button"
            on:click={send}
        >
            KALDIR
        </button>
    </div>
</article>
