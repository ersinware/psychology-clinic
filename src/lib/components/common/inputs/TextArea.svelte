<script>
    import Tooltip from "$lib/components/common/Tooltip.svelte";
    import {
        areEqualStrings,
        getStore,
    } from "$lib/js/client/common/util.client.common";
    import { onMount } from "svelte";
    import { waitFor } from "$lib/js/common/util.common.js";

    export let wrapperStyle,
        wrapperClasses,
        inputClasses,
        inputStyle,
        name,
        title,
        value,
        tText,
        validate,
        format,
        valid,
        disable,
        optional,
        validInVisual,
        enterKeyHint,
        rows,
        placeholder;

    const bigScreen = getStore("bigScreen");

    let input,
        focus,
        exitedOnce,
        tVisible,
        editMode,
        firstValue,
        empty = !value;

    if (value) {
        editMode = true;
        firstValue = value;
        validInVisual = true;
        valid = "notEdited";
    }

    if (optional || disable) valid = true;

    onMount(_onMount);

    function _onMount() {
        if (!disable && input === document.activeElement) focus = true;
    }

    async function onFocus(event) {
        event.target.setSelectionRange(
            event.target.value.length,
            event.target.value.length,
        );
        focus = true;
        tVisible = true;

        if ($bigScreen) return;

        await waitFor(250);
        event.target.scrollIntoView({
            inline: "center",
            block: "center",
            behavior: "smooth",
        });
    }

    function onBeforeInput(event) {
        if (!format || !event.data) return;

        const formatted = format(event.target.value + event.data, event.data);
        if (!formatted) return;

        const newValue = formatted.newValue;
        if (newValue) {
            event.target.value = newValue;
            event.preventDefault();

            return;
        }

        if (formatted.preventDefault) event.preventDefault();
    }

    function onInput(event) {
        const newValue = event.target.value;
        if (!newValue) {
            empty = true;

            if (optional) {
                valid = true;
                validInVisual = undefined;
                tVisible = exitedOnce = false;

                return;
            }
        } else empty = false;

        const validation = validate(newValue, name);

        if (editMode && areEqualStrings(newValue, firstValue))
            valid = "notEdited";
        else valid = validation;

        tVisible = !validation;

        if (exitedOnce) validInVisual = validation;
    }

    function onBlur(event) {
        focus = false;

        if (optional && !event.target.value) {
            tVisible = false;

            return;
        }

        if (exitedOnce) {
            tVisible = !validInVisual;

            return;
        }

        exitedOnce = true;

        if (validate(event.target.value, name)) {
            markValidInVisual();

            return;
        }

        markInvalidInVisual();
    }

    function markValidInVisual() {
        validInVisual = true;
        tVisible = false;
    }

    function markInvalidInVisual() {
        validInVisual = false;
        tVisible = true;
    }
</script>

<Tooltip
    --tooltip-background-color={validInVisual === false
        ? "var(--error-color)"
        : ""}
    --tooltip-text-color={validInVisual === false ? "white" : ""}
    style={wrapperStyle ?? ""}
    classes={wrapperClasses}
    text={tText}
    bind:visible={tVisible}
    bind:dontCloseOnHover={validInVisual}
    manual
>
    <div class="input-wrapper p-r">
        <textarea
            id={name}
            {name}
            value={value ?? ""}
            disabled={disable}
            enterkeyhint={enterKeyHint ?? "next"}
            {rows}
            style={inputStyle ?? ""}
            class="input-text b-box w-100 t-a-c f-w-600 {inputClasses ?? ''}"
            class:focus
            class:empty
            class:valid={validInVisual}
            class:invalid={validInVisual === false}
            class:disabled={disable}
            bind:this={input}
            on:focus={onFocus}
            on:beforeinput={onBeforeInput}
            on:input={onInput}
            on:blur={onBlur}
            {placeholder}
        />

        <label class="input-label p-none p-a p-c-h f-w-800" for={name}>
            {title}{optional ? " - TERCİHEN" : ""}
        </label>
    </div>
</Tooltip>

<style>
    textarea {
        line-height: 1.25rem;
    }
</style>
