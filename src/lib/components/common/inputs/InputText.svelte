<script>
    import Tooltip from "$lib/components/common/Tooltip.svelte";
    import {
        areEqualStrings,
        getStore,
    } from "$lib/js/client/common/util.client.common";
    import { waitFor } from "$lib/js/common/util.common.js";
    import { onMount } from "svelte";

    export let wrapperStyle,
        wrapperClasses,
        inputStyle,
        inputClasses,
        name,
        type,
        inputmode,
        title,
        value,
        tText,
        validate,
        format,
        valid,
        command,
        disable,
        optional,
        validInVisual,
        enterKeyHint,
        placeholder;

    let input,
        focus,
        exitedOnce,
        tVisible,
        editMode,
        firstValue,
        empty = !value && value !== 0;

    const bigScreen = getStore("bigScreen");

    $: onCommand(command);

    onMount(_onMount);

    if (value || value === 0) {
        editMode = true;
        firstValue = value;
        validInVisual = true;
        valid = "notEdited";
    }

    if (optional || disable) valid = true;

    function onCommand() {
        if (!command) return;

        switch (command.type) {
            case "checkValidation":
                if (command.ifExitedOnce && !exitedOnce) return;

                const validation = validate(value);
                valid = validation;
                tVisible = !validation;
                validInVisual = validation;
                empty = !value && value !== 0;

                break;
        }

        command = undefined;
    }

    function _onMount() {
        if (!disable && input === document.activeElement) focus = true;
    }

    async function onFocus(event) {
        if (type !== "email" && type !== "number")
            event.target.setSelectionRange(
                event.target.value.length,
                event.target.value.length,
            );

        focus = true;
        tVisible = true;

        if ($bigScreen) return;

        await waitFor(250);
        event.target.scrollIntoView({ block: "center", behavior: "smooth" });
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
        const newValue = (value = event.target.value);

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

    function onPaste(event) {
        empty =
            (event.clipboardData ?? window.clipboardData).getData("text")
                .length === 0;

        if (empty) return;

        onInput(event);
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
        <input
            id={name}
            {name}
            {type}
            {inputmode}
            value={value ?? ""}
            disabled={disable}
            enterkeyhint={enterKeyHint ?? "next"}
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

        <label class="input-label p-none p-a p-c f-w-800" for={name}>
            {title}{optional ? " - TERCİHEN" : ""}
        </label>
    </div>
</Tooltip>
