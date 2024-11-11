<script>
    import { browser } from "$app/environment"
    import { afterNavigate, beforeNavigate } from "$app/navigation"
    import { page } from "$app/stores"
    import DynamicModals from "$lib/components/common/DynamicModals.svelte"
    import Lamp from "$lib/components/common/Lamp.svelte"
    import Progress from "$lib/components/common/Progress.svelte"
    import Ripple from "$lib/components/common/Ripple.svelte"
    import Snackbars from "$lib/components/common/snackbar/Snackbars.svelte"
    import "$lib/css/common/big-screen/global.big.screen.common.css"
    import "$lib/css/common/small-screen/global.bottom.bar.small.screen.common.css"
    import "$lib/css/common/global.common.css"
    import "$lib/css/common/global.inputs.common.css"
    import "$lib/css/common/global.modals.common.css"
    import "$lib/css/common/small-screen/global.small.screen.common.css"
    import "$lib/css/common/big-screen/project.global.big.screen.common.css"
    import "$lib/css/common/project.global.common.css"
    import "$lib/css/common/small-screen/project.global.small.screen.common.css"
    import {
        ERROR_NO_INTERNET_CONNECTION,
        ONLINE_BACK,
    } from "$lib/js/client/common/constants.client.common.js"
    import {
        anyBackButtonInterceptor,
        createStore,
        getStore,
        init as initUtil,
        interceptBackButton
    } from "$lib/js/client/common/util.client.common.js"
    import { init as initUtilInputs } from "$lib/js/client/common/util.inputs.client.common.js"
    import { init as initUtilLamp } from "$lib/js/client/common/util.lamp.client.common.js"
    import {
        anyOpenModal,
        closeLastModal,
        init as initUtilModals,
    } from "$lib/js/client/common/util.modals.client.common.js"
    import { init as initUtilResponsive } from "$lib/js/client/common/util.responsive.client.common.js"
    import {
        init as initSnackbars,
        showErrorSnackbar,
        showPositiveSnackbar,
    } from "$lib/js/client/common/util.snackbars.client.common.js"
    import { SEARCH_PARAM_FOR_UNKNOWN_ERROR } from "$lib/js/common/constants.common.js"
    import { onMount } from "svelte"
    import {waitFor} from "$lib/js/common/util.common.js";

    createStores()

    const navigationState = getStore("navigationState"),
        dontInterruptModal = getStore("dontInterruptModal")

    let firstTime = true

    if (browser) init()

    onMount(_onMount)

    beforeNavigate(_beforeNavigate)
    afterNavigate(_afterNavigate)

    function createStores() {
        createStore("session")
        createStore("touchable")
        createStore("hoverable")
        createStore("bigScreen")
        createStore("navigationState")
        createStore("rippleTargetInfo")
        createStore("openSnackbars", [])
        createStore("openModals", [])
        createStore("openDynamicModals", [])
        createStore("dontInterruptModal")
        createStore("holder")
    }

    function init() {
        const bigScreen = getStore("bigScreen")

        initUtil(getStore("rippleTargetInfo"), dontInterruptModal)
        initUtilLamp(dontInterruptModal)
        initUtilInputs(dontInterruptModal)
        initSnackbars(getStore("openSnackbars"), bigScreen)
        initUtilModals(
            getStore("openModals"),
            getStore("openDynamicModals"),
            getStore("holder")
        )
        initUtilResponsive(
            getStore("touchable"),
            getStore("hoverable"),
            bigScreen,
        )
    }

    async function _onMount() {
        await navigator.serviceWorker.ready
        navigator.serviceWorker.addEventListener(
            "message",
            onMessageFromServiceWorker,
        )

        await waitFor(1000)
        page.subscribe((value) => {
            handleSearchParam(value.url.search)
        })
    }

    async function onMessageFromServiceWorker(event) {
        switch (event.data.type) {
            case ERROR_NO_INTERNET_CONNECTION:
                showErrorSnackbar(
                    "İnternet bağlantınız koptu. Bazı fonksiyonlar çalışmayabilir.",
                )

                break
            case ONLINE_BACK:
                showPositiveSnackbar("Tekrar çevrimiçi oldunuz.")

                break
        }
    }

    function _beforeNavigate({ type, cancel }) {
        if (type === "popstate") {
            if (anyBackButtonInterceptor()) {
                interceptBackButton()
                cancel()

                return
            }

            if ($dontInterruptModal) {
                cancel()

                return
            }

            if (anyOpenModal()) {
                closeLastModal()
                cancel()

                return
            }
        }

        if (type !== "leave") $navigationState = "navigating"
    }

    function _afterNavigate() {
        if (firstTime) {
            firstTime = false

            return
        }

        $navigationState = "navigated"
    }

    function handleSearchParam(search) {
        switch (decodeURI(search).substring(1)) {
            case SEARCH_PARAM_FOR_UNKNOWN_ERROR:
                showErrorSnackbar("Bilinmeyen bir hata meydana geldi.")
                break
        }
    }
</script>

<slot />

<DynamicModals />
<Lamp />
<Ripple />
<Snackbars />
<Progress bind:state={$navigationState} />
