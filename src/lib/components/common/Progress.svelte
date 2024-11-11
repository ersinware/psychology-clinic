<script>
    export let state, forModal

    let navigating, navigated, hide, navigatingTimeout, navigatedTimeout

    $: onChange(state)

    function onChange() {
        if (state === 'navigating') onNavigating()
        else if (state === 'navigated') onNavigated()
    }

    function onNavigating() {
        clearTimeout(navigatingTimeout)

        if (navigating || navigated) {
            hide = true
            navigating = false
            navigated = false
        }

        navigatingTimeout = setTimeout(() => {
            navigated = false
            hide = false
            navigating = true
        }, 50)
    }

    function onNavigated() {
        clearTimeout(navigatingTimeout)
        clearTimeout(navigatedTimeout)

        navigated = true
        hide = false
        navigating = false

        navigatedTimeout = setTimeout(
            () => {
                hide = true
                navigated = false
                navigating = false
            },
            !forModal ? 1250 : 750
        )
    }
</script>

<article
    class="wrapper t-0 b-r-d"
    class:p-f={!forModal}
    class:p-a={forModal}
    class:navigating
    class:navigated
    class:hide
    class:forModal
/>

<style>
    .wrapper {
        z-index: 100;

        left: 0;

        width: 0;
        height: 0.25rem;

        /* background: linear-gradient(to right, rgb(81, 191, 201), var(--accent-color), rgb(224, 56, 56)); */
        background-color: var(--accent-color);
    }

    .forModal {
        left: 50%;
        transform: translateX(-50%);
    }

    .navigating {
        transition: width 15s;
        width: 75%;
    }

    .navigated {
        transition: width 1s;
        width: 100%;
    }

    .hide {
        opacity: 0;
    }

    .forModal.navigating {
        transition: width 15s;
    }

    .forModal.navigated {
        transition: width 0.5s;
    }
</style>
