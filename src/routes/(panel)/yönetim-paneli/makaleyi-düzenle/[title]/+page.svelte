<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import InputText from "$lib/components/common/inputs/InputText.svelte";
    import TextArea from "$lib/components/common/inputs/TextArea.svelte";
    import TextEditor from "$lib/components/panel/TextEditor.svelte";
    import {
        DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED,
        TRANSITION_PAGE,
    } from "$lib/js/client/common/constants.transitions.client.common.js";
    import {
        getStore,
        isSvg,
        onLinkClick,
        performRippleEffect,
        performRippleEffectAndWait,
        yieldToMain,
    } from "$lib/js/client/common/util.client.common.js";
    import {
        getLinkForResponsiveImage,
        getMediaQueryForResponsiveImage,
    } from "$lib/js/client/common/util.responsive.client.common.js";
    import {
        showErrorSnackbar,
        showPositiveSnackbar,
    } from "$lib/js/client/common/util.snackbars.client.common.js";
    import { onValidityChange } from "$lib/js/client/common/util.validations.client.common.js";
    import {
        removeTrackingFormDifference,
        trackFormForDifference,
    } from "$lib/js/client/panel/util.client.panel.js";
    import {
        formatArticleFirstSentence,
        formatArticleTitle,
        validateArticleContent,
        validateArticleFirstSentence,
        validateArticleTitle,
    } from "$lib/js/client/panel/util.validations.client.panel.js";
    import { PAGE_ARTICLE_IMAGE_MEDIA_DATA } from "$lib/js/common/constants.media.data.common.js";
    import { getDashedString, waitFor } from "$lib/js/common/util.common.js";
    import { onDestroy, onMount } from "svelte";
    import { fly } from "svelte/transition";

    export let data;

    const arrFormValid = new Array(3),
        navigationState = getStore("navigationState"),
        formId = "edit-article-form";

    let form, imageUploaderInput, image, disable, changed;

    $: formValid = onValidityChange(arrFormValid);

    onMount(_onMount);

    if (browser) onDestroy(_onDestroy);

    async function _onMount() {
        imageUploaderInput = document.getElementById("image-uploader");
        imageUploaderInput.addEventListener("change", onImageChange);

        await yieldToMain();

        trackFormForDifference(
            form,
            {
                title: data.article.title,
                "first-sentence": data.article.firstSentence,
                content: await document.getElementById("content").getContent(),
            },
            onFormInput,
        );

        await waitFor(DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED);
        showPositiveSnackbar(
            "Fotoğrafın SVG formatında ya da 2880x2800 boyutunda olmasını tavsiye ederiz.",
        );
    }

    function _onDestroy() {
        imageUploaderInput.removeEventListener("change", onImageChange);

        if (changed !== "always") removeTrackingFormDifference(form);
    }

    function onFormInput(same) {
        if (changed === "always") return;

        changed = !same;
    }

    async function onAddPhotoClick(event) {
        if (disable) return;

        await performRippleEffectAndWait(event);

        imageUploaderInput.click();
    }

    function onImageChange(event) {
        const _image = event.target.files[0];

        if (!_image) return;

        if (_image.size > 2 * 1024 * 1024) {
            showErrorSnackbar("Fotoğraf boyutu 2 MB'dan fazla olamaz.");

            return;
        }

        image = _image;
        image.url = URL.createObjectURL(image);
        changed = "always";
        removeTrackingFormDifference(form);
    }

    async function onEditClick(event) {
        disable = true;
        $navigationState = "navigating";

        performRippleEffect(event);

        const formData = new FormData();

        if (image) formData.append("image", image);

        formData.append(
            "article",
            JSON.stringify({
                id: data.article.id,
                title: document.getElementById("title").value,
                firstSentence: document.getElementById("first-sentence").value,
                content: await document.getElementById("content").getContent(),
            }),
        );

        const response = await fetch(
            "/yönetim-paneli/api/article/edit-article",
            {
                method: "PUT",
                body: formData,
            },
        );

        if (response.status === 200) onSuccess();
        else onError((await response.json()).error);
    }

    async function onSuccess() {
        $navigationState = "navigated";
        await waitFor(DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED);

        await goto("/yönetim-paneli", { replaceState: true });
        await waitFor(DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED);

        showPositiveSnackbar(
            "Makaleniz düzenleniyor... Bu işlem birkaç dakika sürebilir.",
        );
    }

    async function onError(error) {
        $navigationState = "navigated";
        await waitFor(DURATION_TRANSITION_PROGRESS_BAR_NAVIGATED);
        disable = false;
        showErrorSnackbar(error);
    }
</script>

<svelte:head>
    {#if isSvg(data.article.imageName)}
        <link
            rel="preload"
            href={`/api/image/${data.article.imageName}?updated-at=${data.article.imageUpdatedAt}`}
            as="image"
            type="image/svg+xml"
            fetchpriority="high"
        />
    {:else}
        {#each PAGE_ARTICLE_IMAGE_MEDIA_DATA as media}
            <link
                rel="preload"
                href={getLinkForResponsiveImage(
                    data.article.imageName,
                    media,
                    data.article.imageUpdatedAt,
                )}
                as="image"
                type={"image/webp"}
                media={getMediaQueryForResponsiveImage(media)}
                fetchpriority="high"
            />
        {/each}
    {/if}

    <title>
        Makaleyi Düzenle | Yönetim Paneli | Uzman Klinik Psikolog Zeynep Başar |
        İzmir, Alsancak
    </title>
</svelte:head>

<form
    id={formId}
    class="grid page-gap max-w-page m-h-auto"
    in:fly={TRANSITION_PAGE}
    bind:this={form}
    on:submit|preventDefault
>
    <div
        class="flex a-i-c big-screen-g-h-d small-screen-f-column-reverse small-screen-g-v-d"
    >
        <div class="section-texts-wrapper flex f-column g-v-d big-screen-w-100">
            <div>
                <p
                    class="smaller-t-hint t-hint-at-top unimportant-text-color"
                    style:margin-left=".2rem"
                >
                    ZEYNEP BAŞAR'IN KALEMİNDEN
                </p>

                <InputText
                    inputClasses="input-style-article-title t-capitalize t-a-l f-w-700"
                    type="text"
                    title=""
                    placeholder="Başlık"
                    name="title"
                    value={data.article.title}
                    tText="En az 2, en fazla 50 karakter olmalı"
                    format={formatArticleTitle}
                    validate={validateArticleTitle}
                    bind:valid={arrFormValid[0]}
                    bind:disable
                />
            </div>

            <TextArea
                inputClasses="input-style-first-sentence t-a-l"
                type="text"
                title=""
                placeholder="Makalenin içeriği hakkında kısa bir açıklama"
                name="first-sentence"
                value={data.article.firstSentence}
                tText="En az 10, en fazla 500 karakter olmalı"
                rows={7}
                format={formatArticleFirstSentence}
                validate={validateArticleFirstSentence}
                bind:valid={arrFormValid[1]}
                bind:disable
            />
        </div>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="section-image w-100">
            {#if image}
                <div
                    class:pointer={!disable}
                    on:click={onAddPhotoClick}
                    in:fly={{
                        ...TRANSITION_PAGE,
                        y: "-" + TRANSITION_PAGE.y,
                    }}
                >
                    {#key image.url}
                        <div
                            id="uploaded-image-wrapper"
                            class="section-image hoverable-image-wrapper w-100 o-hidden b-r-d"
                            in:fly={{
                                ...TRANSITION_PAGE,
                                y: "-" + TRANSITION_PAGE.y,
                            }}
                        >
                            <img
                                src={image.url}
                                class="section-image hoverable-image w-100"
                                alt="Yeni Eklenecek Makalenin Fotoğrafı"
                            />
                        </div>
                    {/key}
                </div>
            {:else}
                <div
                    class="section-image hoverable-image-wrapper w-100 o-hidden b-r-d"
                    class:pointer={!disable}
                    on:click={onAddPhotoClick}
                >
                    {#if isSvg(data.article.imageName)}
                        <img
                            class="section-image hoverable-image w-100"
                            src="/api/image/{data.article
                                .imageName}?updated-at={data.article
                                .imageUpdatedAt}"
                            alt="Yeni Eklenecek Makalenin Fotoğrafı"
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
                                class="section-image hoverable-image w-100"
                                src="/blank.svg"
                                alt="Yeni Eklenecek Makalenin Fotoğrafı"
                            />
                        </picture>
                    {/if}
                </div>
            {/if}
        </div>

        <input
            id="image-uploader"
            class="d-none"
            type="file"
            accept="image/*"
            name="image"
        />
    </div>

    <div
        class="b-box last-section panel-full-w wrapper-with-left-menu page-p-v-d p-h-d secondary-background-color"
    >
        <div class="max-w-small-page m-h-auto">
            <TextEditor
                placeholder="Makalenin içeriği"
                name="content"
                value={data.article.content}
                tText="En az 100 karakter olmalı"
                validate={validateArticleContent}
                {formId}
                bind:valid={arrFormValid[2]}
                bind:disable
            />

            <div
                class="add-or-edit-article-buttons-wrapper flex j-c-c modal-buttons-g"
            >
                <a
                    href="/yönetim-paneli"
                    class:disabled-nude-button={disable}
                    class="nude-button modal-button nude-button-negative-unimportant"
                    on:click={onLinkClick}
                >
                    VAZGEÇ
                </a>

                <button
                    type="button"
                    disabled={!formValid || disable || !changed}
                    class:disabled-nude-button={!formValid ||
                        disable ||
                        !changed}
                    class="nude-button modal-button nude-button"
                    on:click={onEditClick}
                >
                    DÜZENLE
                </button>
            </div>
        </div>
    </div>
</form>
