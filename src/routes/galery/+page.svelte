<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import IntersectionObserver from "$lib/components/IntersectionObserver.svelte";
    import { enhance } from "$app/forms";
    import type { PageData } from "./$types";
    export let data: PageData;

    let files: File[] = [];
    let galeries: Galery[] = [];
    let updateElement: HTMLFormElement;
    let deleteGaleryId: number;
    let deleteGaleryIndex: number;
    let deleteImageIndex: number;

    function handleFileSelect(event) {
        files = event.target.files;
    }

    let showInputFields: boolean[] = [];

    onMount(async () => {
        try {
            const response = await fetch("/api/v1/main/galery/getImages");
            const data = await response.json();

            galeries = data.galeries;
        } catch (error) {
            console.error("Error:", error);
        }
    });

    function showInput(i: number) {
        setTimeout(() => {
            showInputFields[i] = true;
        }, 20);
    }

    function closeAllInput() {
        showInputFields = showInputFields.map(() => false);
    }

    function handleClickOutside(event: MouseEvent) {
        setTimeout(() => {
            if (updateElement && !updateElement.contains(event.target)) {
                closeAllInput();
            }
        }, 10);
    }

    async function handleDeleteGalery() {
        if (
            confirm(
                "Möchtest du " +
                    galeries[deleteGaleryIndex].name +
                    " wirklich löschen?"
            )
        ) {
            const form = document.querySelector(
                'form[action="?/deleteGalery"]'
            );
            const idInput = form.querySelector('input[name="id"]');

            idInput.value = deleteGaleryId;

            form.submit();
        }
    }

    async function handleDeleteImage() {
        if (
            confirm(
                "Möchtest du " +
                    galeries[deleteGaleryIndex].image[deleteImageIndex].url +
                    " wirklich löschen?"
            )
        ) {
            const form = document.querySelector('form[action="?/deleteImage"]');
            const idInput = form.querySelector('input[name="id"]');
            const urlInput = form.querySelector('input[name="url"]');

            idInput.value =
                galeries[deleteGaleryIndex].image[deleteImageIndex].id;
            urlInput.value =
                galeries[deleteGaleryIndex].image[deleteImageIndex].url;

            form.submit();
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="grid md:grid-cols-2">
    <div>
        <h2 class="mb-2">Fotos hochladen</h2>
        <form
            action="?/uploadImages"
            enctype="multipart/form-data"
            method="POST"
        >
            <div class="mb-2">
                <label for="folderId">Ordner:</label>
                <select name="folderId" id="folderId" required>
                    {#each galeries as folder}
                        <option value={folder.id}>{folder.name}</option>
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
            {#if files.length > 0}
                <h3>Fotos</h3>
                {#each Array.from(files) as file}
                    <p>{file.name} ({file.size} bytes)</p>
                {/each}
            {/if}
        </div>
    </div>

    <div>
        <h2 class="mb-2">Ordner bearbeiten</h2>
        <form action="?/createGalery" method="POST" class="w-80">
            <input
                type="text"
                name="galery"
                id="galery"
                placeholder="neuen Ordner"
                required
            />

            <button
                class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
                type="submit"
            >
                <p class="group-hover:scale-105">Speichern</p>
            </button>
        </form>

        <div class="mb-5"></div>

        <ul class="grid">
            {#each galeries as galery, i}
                <li in:slide class="flex h-10 w-80 my-1">
                    {#if showInputFields[i] == true}
                        <form
                            action="?/updateGalery"
                            method="POST"
                            class="flex -mt-2"
                            bind:this={updateElement}
                            use:enhance
                        >
                            <input
                                type="text"
                                bind:value={galery.name}
                                name="galery"
                                class="w-full"
                            />
                            <input
                                hidden
                                type="number"
                                name="id"
                                bind:value={galery.id}
                            />

                            <button
                                class="ml-1 mb-2 bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
                                type="submit"
                            >
                                <p class="group-hover:scale-105">Speichern</p>
                            </button>
                        </form>

                        <div class="group ml-3 -mr-6">
                            <button
                                disabled={!data.isAdmin}
                                class="flex items-center justify-center"
                                on:click={() => {
                                    deleteGaleryId = galery.id;
                                    deleteGaleryIndex = i;
                                }}
                                on:click={handleDeleteGalery}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                    class={data.isAdmin
                                        ? "fill-red-500 group-hover:scale-110"
                                        : "fill-gray-500"}
                                >
                                    <path
                                        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                                    />
                                </svg>
                            </button>
                        </div>
                    {:else}
                        <div>
                            <button
                                on:click={() => {
                                    showInput(i);
                                }}
                                class="group"
                            >
                                <div class="w-full flex justify-between">
                                    <div class="ml-2">
                                        <p>
                                            {galery.name}
                                        </p>
                                    </div>

                                    <div class="-mr-6 ml-3">
                                        <svg
                                            class="fill-black h-6 w-6 group-hover:scale-110 group-hover:fill-gray-700 transition-all"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 -960 960 960"
                                            width="24"
                                        >
                                            <path
                                                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        </div>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
</div>

{#each galeries as galery, g}
    <div class="mt-12"></div>
    <h2>{galery.name}</h2>

    {#if galery.image.length > 0}
        <ul
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-rows-auto"
        >
            {#each galery.image as photo, i}
                <li class="relative hover:scale-102 h-48">
                    <IntersectionObserver animation="fade-in">
                        <div>
                            <img
                                loading="lazy"
                                class="block h-48 w-full rounded-md shadow-md object-cover object-center"
                                src={photo.url}
                                alt=""
                            />
                        </div>
                        <div
                            class="opacity-0 pointer-events-none !hover:opacity-100 w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-3xl text-white bold"
                        >
                            vergrössern
                        </div>
                    </IntersectionObserver>

                    <button
                        class="absolute inset-0 transition duration-150 group hover:bg-red-500 hover:bg-opacity-50 rounded-md"
                        on:click={() => {
                            deleteGaleryIndex = g;
                            deleteImageIndex = i;
                        }}
                        on:click={handleDeleteImage}
                    >
                        <div
                            class="hidden group-hover:flex justify-center items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="30"
                                viewBox="0 -960 960 960"
                                width="30"
                                class=" fill-white group-hover:scale-110"
                            >
                                <path
                                    d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                                />
                            </svg>
                        </div>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
{/each}

<form class="hidden" action="?/deleteGalery" method="POST">
    <input hidden type="number" name="id" id="id" />
</form>
<form class="hidden" action="?/deleteImage" method="POST">
    <input hidden type="number" name="id" id="id" />
    <input hidden type="string" name="url" id="url" />
</form>
