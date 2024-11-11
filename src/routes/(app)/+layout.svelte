<script>
    import '$lib/css/app/project.global.app.css'
    import {TRANSITION_PAGE} from "$lib/js/client/common/constants.transitions.client.common.js";
    import {fly} from "svelte/transition";
    import Footer from "$lib/components/app/layout/Footer.svelte";
    import BottomBar from "$lib/components/app/layout/BottomBar.svelte";
    import Header from "$lib/components/app/layout/Header.svelte";
</script>

<div id="main-wrapper"
     class="b-box big-screen-p-t-for-header-for-page big-screen-page-p-b small-screen-page-p-t small-screen-page-p-b">

    <main class="b-box max-w p-h-d m-h-auto" in:fly={TRANSITION_PAGE}>
        <slot/>
    </main>
</div>

<Header/>
<BottomBar/>
<Footer/>