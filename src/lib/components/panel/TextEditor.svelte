<script>
    import { browser } from "$app/environment";
    import Tooltip from "$lib/components/common/Tooltip.svelte";
    import { DURATION_WAIT_FOR_RIPPLE_TYPE_ONE } from "$lib/js/client/common/constants.transitions.client.common";
    import {
        areEqualStrings,
        performRippleEffectAndWait,
        yieldToMain,
    } from "$lib/js/client/common/util.client.common";
    import { EVENT_TEXT_EDITOR_UPDATED } from "$lib/js/common/constants.common";
    import { waitFor } from "$lib/js/common/util.common";
    import Underline from "@tiptap/extension-underline";
    import StarterKit from "@tiptap/starter-kit";
    import { onDestroy, onMount } from "svelte";
    import { BubbleMenu, createEditor, EditorContent } from "svelte-tiptap";

    export let name,
        value,
        tText,
        validate,
        valid,
        disable,
        optional,
        validInVisual,
        placeholder,
        getContent,
        formId;

    let input,
        focus,
        exitedOnce,
        tVisible,
        editMode,
        firstValue,
        empty = !value,
        editor,
        editorWorking;

    if (value) {
        editMode = true;
        firstValue = value;
        validInVisual = true;
        valid = "notEdited";
    }

    if (optional || disable) valid = true;

    onMount(_onMount);

    if (browser) onDestroy(_onDestroy);

    async function _onMount() {
        if (disable) {
            getContent = () =>
                document.querySelector(`#input-wrapper-${name} .tiptap`)
                    .innerHTML;

            return;
        }

        editor = createEditor({
            extensions: [StarterKit, Underline],
            content: value,
            onFocus,
            onUpdate: onInput,
            onBlur,
            editorProps: {
                handlePaste(view, event) {
                    event.preventDefault();

                    view.dispatch(
                        view.state.tr.insertText(
                            event.clipboardData.getData("text/plain"),
                        ),
                    );

                    return true;
                },
            },
        });

        await yieldToMain();

        input = document.querySelector(`#input-wrapper-${name} .tiptap`);
        input.id = name;
        input.getContent = async () => {
            await yieldToMain();
            return $editor.getHTML();
        };

        if (input === document.activeElement) focus = true;
    }

    function _onDestroy() {
        if (editor) $editor.destroy();
    }

    async function onFocus() {
        if (editorWorking) return;

        focus = true;
        tVisible = true;
    }

    function onInput() {
        if (editorWorking) return;

        window.dispatchEvent(
            new CustomEvent(`${EVENT_TEXT_EDITOR_UPDATED}_${formId}`, {
                detail: { formId, id: name },
            }),
        );

        const newValue = input.innerText.trim();

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

    async function onBlur() {
        await waitFor(DURATION_WAIT_FOR_RIPPLE_TYPE_ONE);

        if (editorWorking) return;

        const value = input.innerText.trim();

        focus = false;

        if (optional && !value) {
            tVisible = false;

            return;
        }

        if (exitedOnce) {
            tVisible = !validInVisual;

            return;
        }

        exitedOnce = true;

        if (validate(value, name)) {
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

    async function onChange(event, f) {
        editorWorking = true;

        await performRippleEffectAndWait(event);
        f();

        window.dispatchEvent(
            new CustomEvent(`${EVENT_TEXT_EDITOR_UPDATED}_${formId}`, {
                detail: { formId, id: name },
            }),
        );

        await waitFor(DURATION_WAIT_FOR_RIPPLE_TYPE_ONE);
        editorWorking = false;
    }
</script>

<Tooltip
    --tooltip-background-color={validInVisual === false
        ? "var(--error-color)"
        : ""}
    --tooltip-text-color={validInVisual === false ? "white" : ""}
    text={tText}
    bind:visible={tVisible}
    bind:dontCloseOnHover={validInVisual}
    manual
>
    <div id="editor-icons-wrapper">
        <div class="background-color">
            <div class="secondary-background-color">
                <article
                    id="editor-icons"
                    class="flex g-1dot5 third-background-color b-r-d b-shadow"
                >
                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "heading",
                                {
                                    level: 2,
                                },
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5711 8 22.25 9.67893 22.25 11.75C22.25 12.6074 21.9623 13.3976 21.4781 14.0292L21.3302 14.2102L18.0343 18H22V20H15L14.9993 18.444L19.8207 12.8981C20.0881 12.5908 20.25 12.1893 20.25 11.75C20.25 10.7835 19.4665 10 18.5 10C17.5818 10 16.8288 10.7071 16.7558 11.6065L16.75 11.75H14.75C14.75 9.67893 16.4289 8 18.5 8Z"
                            ></path>
                        </svg>
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "heading",
                                {
                                    level: 3,
                                },
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M22 8L21.9984 10L19.4934 12.883C21.0823 13.3184 22.25 14.7728 22.25 16.5C22.25 18.5711 20.5711 20.25 18.5 20.25C16.674 20.25 15.1528 18.9449 14.8184 17.2166L16.7821 16.8352C16.9384 17.6413 17.6481 18.25 18.5 18.25C19.4665 18.25 20.25 17.4665 20.25 16.5C20.25 15.5335 19.4665 14.75 18.5 14.75C18.214 14.75 17.944 14.8186 17.7056 14.9403L16.3992 13.3932L19.3484 10H15V8H22ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 4 })
                                    .run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "heading",
                                {
                                    level: 4,
                                },
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM22 8V16H23.5V18H22V20H20V18H14.5V16.66L19.5 8H22ZM20 11.133L17.19 16H20V11.133Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(
                                event,
                                $editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 5 })
                                    .run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "heading",
                                {
                                    level: 5,
                                },
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M22 8V10H17.6769L17.2126 12.6358C17.5435 12.5472 17.8912 12.5 18.25 12.5C20.4591 12.5 22.25 14.2909 22.25 16.5C22.25 18.7091 20.4591 20.5 18.25 20.5C16.4233 20.5 14.8827 19.2756 14.4039 17.6027L16.3271 17.0519C16.5667 17.8881 17.3369 18.5 18.25 18.5C19.3546 18.5 20.25 17.6046 20.25 16.5C20.25 15.3954 19.3546 14.5 18.25 14.5C17.6194 14.5 17.057 14.7918 16.6904 15.2478L14.8803 14.3439L16 8H22ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(
                                event,
                                $editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 6 })
                                    .run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "heading",
                                {
                                    level: 6,
                                },
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M21.097 8L18.499 12.5C20.7091 12.5 22.5 14.2909 22.5 16.5C22.5 18.7091 20.7091 20.5 18.5 20.5C16.2909 20.5 14.5 18.7091 14.5 16.5C14.5 15.7636 14.699 15.0737 15.0461 14.4811L18.788 8H21.097ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 14.5C17.3954 14.5 16.5 15.3954 16.5 16.5C16.5 17.6046 17.3954 18.5 18.5 18.5C19.6046 18.5 20.5 17.6046 20.5 16.5C20.5 15.3954 19.6046 14.5 18.5 14.5Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor.chain().focus().setParagraph().run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "paragraph",
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M12 6V21H10V16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4H20V6H17V21H15V6H12ZM10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14V6Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor.chain().focus().toggleBold().run(),
                            )}
                        disabled={disable ||
                            $editor?.isActive("heading", { level: 2 }) ||
                            $editor?.isActive("heading", { level: 3 }) ||
                            $editor?.isActive("heading", { level: 4 }) ||
                            $editor?.isActive("heading", { level: 5 }) ||
                            $editor?.isActive("heading", { level: 6 })}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive("bold")}
                            class:disabled-editor-icon={disable ||
                                $editor?.isActive("heading", { level: 2 }) ||
                                $editor?.isActive("heading", { level: 3 }) ||
                                $editor?.isActive("heading", { level: 4 }) ||
                                $editor?.isActive("heading", { level: 5 }) ||
                                $editor?.isActive("heading", { level: 6 })}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor.chain().toggleItalic().run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "italic",
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor.chain().focus().toggleUnderline().run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "underline",
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor
                                    .chain()
                                    .focus()
                                    .toggleBulletList()
                                    .run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "bulletList",
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"
                            ></path></svg
                        >
                    </button>

                    <button
                        on:click={(event) =>
                            onChange(event, () =>
                                $editor
                                    .chain()
                                    .focus()
                                    .toggleOrderedList()
                                    .run(),
                            )}
                        disabled={disable}
                    >
                        <svg
                            class="editor-icon b-r-d"
                            class:active-editor-icon={$editor?.isActive(
                                "orderedList",
                            )}
                            class:disabled-editor-icon={disable}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><path
                                d="M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"
                            ></path></svg
                        >
                    </button>
                </article>
            </div>
        </div>
    </div>

    <div
        id="input-wrapper-{name}"
        class="input-wrapper tiptap-wrapper editor b-box p-r"
        class:focus
        class:empty
        class:valid={validInVisual}
        class:invalid={validInVisual === false}
        class:disabled={disable}
    >
        {#if $editor}
            <EditorContent editor={$editor} />
        {:else}
            <div class="tiptap">
                {@html value ?? ""}
            </div>
        {/if}

        {#if !disable && $editor}
            <BubbleMenu editor={$editor}>
                <div id="bubble-menu-wrapper">
                    <div class="background-color">
                        <div class="secondary-background-color">
                            <article
                                id="bubble-menu"
                                class="flex g-dot75 third-background-color b-r-d b-shadow"
                            >
                                {#if !$editor?.isActive( "heading", { level: 2 }, ) && !$editor?.isActive( "heading", { level: 3 }, ) && !$editor?.isActive( "heading", { level: 4 }, ) && !$editor?.isActive( "heading", { level: 5 }, ) && !$editor?.isActive( "heading", { level: 6 }, )}
                                    <button
                                        on:click={(event) =>
                                            onChange(event, () =>
                                                $editor
                                                    .chain()
                                                    .focus()
                                                    .toggleBold()
                                                    .run(),
                                            )}
                                    >
                                        <svg
                                            class="bubble-menu-icon b-r-d"
                                            class:active-editor-icon={$editor?.isActive(
                                                "bold",
                                            )}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            ><path
                                                d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z"
                                            ></path></svg
                                        >
                                    </button>
                                {/if}

                                <button
                                    on:click={(event) =>
                                        onChange(event, () =>
                                            $editor
                                                .chain()
                                                .focus()
                                                .toggleItalic()
                                                .run(),
                                        )}
                                >
                                    <svg
                                        class="bubble-menu-icon b-r-d"
                                        class:active-editor-icon={$editor?.isActive(
                                            "italic",
                                        )}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        ><path
                                            d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"
                                        ></path></svg
                                    >
                                </button>

                                <button
                                    on:click={(event) =>
                                        onChange(event, () =>
                                            $editor
                                                .chain()
                                                .focus()
                                                .toggleUnderline()
                                                .run(),
                                        )}
                                >
                                    <svg
                                        class="bubble-menu-icon b-r-d"
                                        class:active-editor-icon={$editor?.isActive(
                                            "underline",
                                        )}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        ><path
                                            d="M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z"
                                        ></path></svg
                                    >
                                </button>
                            </article>
                        </div>
                    </div>
                </div>
            </BubbleMenu>
        {/if}

        {#if !disable && empty && !$editor?.isActive("bulletList") && !$editor?.isActive("orderedList")}
            <p class="placeholder p-a">{placeholder}</p>
        {/if}
    </div>
</Tooltip>

<style>
    #editor-icons-wrapper {
        position: sticky;
        top: 0;
        z-index: 99;

        background-color: white;
    }

    #editor-icons {
        flex-wrap: wrap;

        padding-left: var(--main-h-padding);
        padding-right: var(--main-h-padding);
        padding-block: 0.75rem;
        margin-bottom: 1rem;

        border-left: 1px var(--third-background-color) solid;
        border-right: 1px var(--third-background-color) solid;
    }

    #bubble-menu-wrapper {
        background-color: white;
    }

    #bubble-menu {
        padding-left: calc(var(--main-h-padding) - 0.75rem);
        padding-right: calc(var(--main-h-padding) - 0.75rem);
        padding-block: 0.5rem;
    }

    .editor-icon,
    .bubble-menu-icon {
        fill: var(--editor-icon-color);
        transition: fill 0.25s ease-in-out;
    }

    .editor-icon {
        width: 1.25rem;
        height: 1.25rem;
    }

    .bubble-menu-icon {
        width: 1.125rem;
        height: 1.125rem;
    }

    .active-editor-icon {
        fill: var(--editor-icon-color-darker);
    }

    .disabled-editor-icon {
        fill: var(--unimportant-text-color) !important;
    }

    @media (hover: hover) {
        .editor-icon:hover,
        .bubble-menu-icon:hover {
            fill: var(--editor-icon-color-darker);
        }

        .active-editor-icon:hover {
            fill: var(--editor-icon-color-very-darker);
        }
    }
</style>
