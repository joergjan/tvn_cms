<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "../$types";

    let files;
    let riegen = [];
    let folderNames = [];

    let selectedRiege = 1;
    let selectedFolder = 1;

    export let data: PageData;
    $: ({ folderNames } = data.folderNames);

    onMount(async () => {
        try {
            const response = await fetch("/api/v1/main/getRiegen");
            const data = await response.json();

            riegen = data.riegen;
        } catch (error) {
            console.error("Error:", error);
        }
    });

    function handleFileSelect(event) {
        files = event.target.files;
    }
</script>

<form action="?/uploadImages" enctype="multipart/form-data" method="POST">
    <div class="mb-2">
        <label for="folderId">Ordner:</label>
        <select
            name="folderId"
            id="folderId"
            bind:value={selectedFolder}
            required
        >
            {#each folderNames as folder}
                <option value={folder.id}>{folder.name}</option>
            {/each}
        </select>
    </div>

    <div class="mb-2">
        <label for="riegeId">Riege:</label>
        <select name="riegeId" id="riegeId" bind:value={selectedRiege} required>
            {#each riegen as riege}
                <option value={riege.id}>{riege.name}</option>
            {/each}
        </select>
    </div>

    <div class="mb-2">
        <label for="images">Fotos</label>
        <input
            type="file"
            id="images"
            name="images"
            multiple
            required
            on:change={handleFileSelect}
        />
    </div>

    <button
        type="submit"
        class="px-3 py-2 rounded-md text-white bg-tvblue hover:bg-tvbluelight group"
    >
        <p class="group-hover:scale-105">speichern</p></button
    >
</form>

<div class="mt-5">
    {#if files}
        <h3>Fotos</h3>
        {#each Array.from(files) as file}
            <p>{file.name} ({file.size} bytes)</p>
        {/each}
    {/if}
</div>
