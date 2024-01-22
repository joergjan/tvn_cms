<script lang="ts">
    import type { PageData } from "../$types";
    import { onMount } from "svelte";

    import { tick } from "svelte";

    export let data: PageData;
    $: ({ post } = data);

    let isLoading = true;

    function openDelete() {
        if (
            confirm(
                "Möchtest du den Beitrag " + post.title + " wirklich löschen? "
            )
        ) {
            const form = document.querySelector('form[action="?/deletePost"]');
            form.submit();
        }
    }

    async function handleDelete(event) {
        event.preventDefault();

        if (confirm("Möchtest du den Beitrag wirklich löschen?")) {
            const formData = new FormData(event.target);

            const response = await fetch("?/deletePost", {
                method: "POST",
                body: new URLSearchParams([...formData]),
            });

            if (response.ok) {
                // Redirect to home if the delete was successful
                location.reload();
            } else {
                // Handle the error
                console.error("Failed to delete post");
            }
        }
    }

    function openFileInput() {
        const fileInput = document.getElementById("image");
        fileInput.click();
    }

    function changeImage() {
        const form = document.querySelector('form[action="?/updateImage"]');
        form.submit();
    }
</script>

<svelte:head>
    <title>Post</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-10">
    <h1>{post.title} bearbeiten</h1>

    <div class="flex items-center">
        <a href="/post">
            <div class="flex mr-5 items-center group">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 group-hover:scale-110"
                    viewBox="0 -960 960 960"
                    width="24"
                    ><path
                        d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"
                    /></svg
                >
                <div class="pl-1 group-hover:scale-105">zurück</div>
            </div>
        </a>

        <div class="justify-center flex ml-2">
            <button
                on:click={openDelete}
                class="bg-red-600 hover:bg-red-500 py-2 px-3 rounded-md text-white group"
            >
                <p class="group-hover:scale-105">Beitrag löschen</p>
            </button>
        </div>
    </div>
    <div class="mt-5" />

    <div class="grid grid-cols-2">
        <form
            action="?/updateRiege"
            method="POST"
            enctype="multipart/form-data"
        >
            <div class="mb-2">
                <label for="title">Titel</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    bind:value={post.title}
                    required
                />
            </div>

            <div class="mb-2">
                <label for="text">Text</label>
                <textarea name="text" id="text" bind:value={post.text} />
            </div>

            <div
                class="bg-tvblue hover:bg-tvbluelight w-min rounded-md px-3 py-2 text-white group"
            >
                <button class="" type="submit">
                    <p class="flex group-hover:scale-105">Speichern</p></button
                >
            </div>
        </form>
        <div class="ml-5">
            <button
                on:click={openFileInput}
                class="group-hover:scale-102 transition-all duration-100 flex relative group hover:scale-105"
            >
                <img
                    class="rounded-md shadow-md"
                    height="200"
                    width="200"
                    src={post.image.url +
                        "?h=350&w=350&crop=faces&lossless=false&auto=compress&fit=crop&fm=webp"}
                    alt=""
                />
                <div
                    class="group-hover:opacity-100 opacity-0 absolute transfrom -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10 transition-all duration-100"
                >
                    <svg
                        class="fill-white h-12 w-12"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                        ><path
                            d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                        /></svg
                    >
                </div>
                <div
                    class="absolute w-full h-full top-0 left-0 bg-black rounded-md group-hover:opacity-20 opacity-0 transition-all duration-100"
                />
            </button>
        </div>
    </div>
</div>

<form action="?/updateImage" enctype="multipart/form-data" method="POST">
    <input
        type="file"
        id="image"
        name="image"
        required
        on:change={changeImage}
        class="hidden"
    />
</form>

<form
    class="hidden"
    action="?/deletePost"
    method="POST"
    on:submit={handleDelete}
/>

<style>
    input[type="text"],
    input[type="email"],
    textarea {
        @apply w-full;
    }
</style>
