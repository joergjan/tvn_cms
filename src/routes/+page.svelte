<script lang="ts">
    import type { PageData } from "./$types";
    import { currentPage } from "$lib/scripts/stores";

    export let data: PageData;
</script>

<h1>Hallo {data.name}!</h1>

<svelte:head>
    <title>TV Nussbaumen</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div>
    <button
        class="bg-tvblue hover:bg-tvbluelight text-white group px-3 py-2 rounded-md"
        on:click={() => {
            $currentPage = 4;
        }}
    >
        <a href="/post/create">
            <p class="flex group-hover:scale-105">Neuen Beitrag erstellen</p></a
        >
    </button>
    <button
        class="bg-tvblue hover:bg-tvbluelight text-white group px-3 py-2 rounded-md"
    >
        <a href="/person/create"
            ><p class="flex group-hover:scale-105">Person hinzufügen</p></a
        >
    </button>
    <button
        class="bg-tvblue hover:bg-tvbluelight text-white group px-3 py-2 rounded-md"
    >
        <a href="/riege"
            ><p class="flex group-hover:scale-105">Riegen bearbeiten</p></a
        >
    </button>
</div>
