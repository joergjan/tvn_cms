<script lang="ts">
    import type { PageData } from "../$types";
    import { onMount } from "svelte";
    import { BlobServiceClient } from "@azure/storage-blob";
    import RiegeModal from "$lib/components/RiegeModal.svelte";
    import { tick } from "svelte";

    export let data: PageData;
    $: ({ riege } = data);
    let additionalLeiter = [false, false, false, false];

    let isLoading = true;
    let weekdays = [];
    let additionalTrainingszeit = false;
    let personen = [];
    let riegen = [];
    let preview = false;

    function handleClose() {
        togglePreview();
    }

    function adjustHeight(event) {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + 15 + "px";
    }

    function toggleTrainingszeit() {
        if (additionalTrainingszeit) {
            additionalTrainingszeit = false;
        } else {
            additionalTrainingszeit = true;
        }
    }

    function openDelete() {
        if (
            confirm(
                "Möchtest du die Riege " + riege.name + " wirklich löschen? "
            )
        ) {
            const form = document.querySelector('form[action="?/deleteRiege"]');
            form.submit();
        }
    }

    async function handleDelete(event) {
        event.preventDefault();

        if (confirm("Möchtest du die Riege wirklich löschen?")) {
            const formData = new FormData(event.target);

            const response = await fetch("?/deleteRiege", {
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

    onMount(async () => {
        try {
            const response = await fetch("/api/v1/main/getWeekdays");
            const data = await response.json();

            weekdays = data.weekdays;

            isLoading = false;
        } catch (error) {
            console.error("Error:", error);
        }

        try {
            const response = await fetch("/api/v1/main/getPersonen");
            const data = await response.json();

            personen = data.personen;

            isLoading = false;

            checkLeiter();
        } catch (error) {
            console.error("Error:", error);
        }

        if (riege.trainingszeiten.length > 1) {
            additionalTrainingszeit = true;
        }

        async function adjustAllTextareas() {
            // Wait for any pending state changes to be applied
            await tick();

            const textareas = document.querySelectorAll("textarea");
            textareas.forEach((textarea) => adjustHeight({ target: textarea }));
        }

        adjustAllTextareas();
    });

    function getHours(isoTime) {
        let date = new Date(isoTime);
        let hours = date.getUTCHours();
        return hours.toString().padStart(2, "0");
    }

    function getMinutes(isoTime) {
        let date = new Date(isoTime);
        let minutes = date.getUTCMinutes();
        return minutes.toString().padStart(2, "0");
    }

    function getTime(isoTime) {
        return `${getHours(isoTime)}:${getMinutes(isoTime)}`;
    }

    function togglePreview() {
        if (preview) {
            preview = false;
        } else {
            preview = true;
        }
    }

    function checkLeiter() {
        for (let i = 0; i < riege.person.length; i++) {
            if (riege.person[i].person.name != "") {
                additionalLeiter[i] = true;
            }
        }
    }
</script>

<div class="mb-10">
    <h1>{riege.name} bearbeiten</h1>

    <div class="flex items-center">
        <a href="/verwaltung/riege">
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
        <div class="justify-center flex">
            <button
                on:click={togglePreview}
                class="bg-tvblue hover:bg-tvbluelight py-2 px-3 rounded-md text-white group"
            >
                <p class="group-hover:scale-105">Vorschau</p>
            </button>
        </div>
        <div class="justify-center flex ml-2">
            <button
                on:click={openDelete}
                class="bg-red-600 hover:bg-red-500 py-2 px-3 rounded-md text-white group"
            >
                <p class="group-hover:scale-105">Riege löschen</p>
            </button>
        </div>
    </div>
    <div class="mt-5" />
    <form action="?/updateRiege" method="POST" enctype="multipart/form-data">
        <div>
            <label for="description">Beschreibung</label>
            <textarea
                name="description"
                id="description"
                bind:value={riege.description}
                required
                autocomplete="off"
                on:input={adjustHeight}
            />
        </div>

        <div class="mb-2">
            <label for="age">Alter</label>
            <input
                type="text"
                name="age"
                id="age"
                bind:value={riege.age}
                autocomplete="off"
            />
        </div>

        <div class="mb-2">
            <label for="from">Von</label>
            <input
                type="time"
                name="from"
                id="from"
                value={getTime(riege.trainingszeiten[0].from)}
                autocomplete="off"
            />

            <label for="to">Bis</label>
            <input
                type="time"
                name="to"
                id="to"
                value={getTime(riege.trainingszeiten[0].to)}
                autocomplete="off"
            />

            <label for="weekday">Tag</label>
            <select
                name="weekday"
                id="weekday"
                bind:value={riege.trainingszeiten[0].weekdayId}
                required
            >
                {#each weekdays as weekday}
                    <option value={weekday.id}>{weekday.name}</option>
                {/each}
            </select>
            {#if !additionalTrainingszeit}
                <button
                    class="bg-tvblue hover:bg-tvbluelight text-white group py-2 px-3 rounded-md text-sm"
                    type="button"
                    on:click={toggleTrainingszeit}
                >
                    <p class="group-hover:scale-105">Weitere Trainingszeit</p>
                </button>
            {/if}
        </div>

        <div class="mb-2">
            {#if additionalTrainingszeit}
                {#if riege.trainingszeiten[1]}
                    <label for="from2">Von</label>
                    <input
                        type="time"
                        name="from2"
                        id="from2"
                        value={getTime(riege.trainingszeiten[1].from)}
                        autocomplete="off"
                    />

                    <label for="to2">Bis</label>
                    <input
                        type="time"
                        name="to2"
                        id="to2"
                        value={getTime(riege.trainingszeiten[1].to)}
                        autocomplete="off"
                    />

                    <label for="weekday2">Tag</label>
                    <select
                        name="weekday2"
                        id="weekday2"
                        required
                        value={riege.trainingszeiten[1].weekday.id}
                    >
                        {#each weekdays as weekday}
                            <option value={weekday.id}>{weekday.name}</option>
                        {/each}
                    </select>
                {:else}
                    <label for="from2">Von</label>
                    <input
                        type="time"
                        name="from2"
                        id="from2"
                        autocomplete="off"
                    />

                    <label for="to2">Bis</label>
                    <input type="time" name="to2" id="to2" autocomplete="off" />

                    <label for="weekday2">Tag</label>
                    <select name="weekday2" id="weekday2" required>
                        {#each weekdays as weekday}
                            <option value={weekday.id}>{weekday.name}</option>
                        {/each}
                    </select>
                {/if}
                <button
                    class="bg-red-600 hover:bg-red-500 text-white group py-2 px-3 rounded-md text-sm"
                    type="button"
                    on:click={toggleTrainingszeit}
                >
                    <p class="group-hover:scale-105">entfernen</p>
                </button>
            {/if}
        </div>

        {#each additionalLeiter as leiter, i}
            {#if leiter}
                <div class="flex items-center space-x-2 mb-2">
                    <label for="personId{i}">Leiter</label>
                    <select
                        name="personId{i}"
                        id="personId{i}"
                        required
                        value={riege.person[i] ? riege.person[i].person.id : 0}
                    >
                        {#each personen as person}
                            <option value={person.id}
                                >{person.firstName} {person.name}</option
                            >
                        {/each}
                    </select>
                    {#if additionalLeiter[i] && i < additionalLeiter.length - 1 && !additionalLeiter[i + 1]}
                        <button
                            class="bg-tvblue hover:bg-tvbluelight text-white group py-2 px-3 rounded-md text-sm"
                            type="button"
                            on:click={() => {
                                additionalLeiter[i + 1] = true;
                            }}
                        >
                            <p class="group-hover:scale-105">Weitere Leiter</p>
                        </button>
                    {/if}
                    {#if additionalLeiter[i] && i > 0 && !additionalLeiter[i + 1]}
                        <button
                            class="bg-red-600 hover:bg-red-500 text-white group py-2 px-3 rounded-md text-sm"
                            type="button"
                            on:click={() => {
                                additionalLeiter[i] = false;
                            }}
                        >
                            <p class="group-hover:scale-105">entfernen</p>
                        </button>
                    {/if}
                </div>
            {/if}
        {/each}

        <div
            class="bg-tvblue hover:bg-tvbluelight w-min rounded-md px-3 py-2 text-white group"
        >
            <button class="" type="submit">
                <p class="flex group-hover:scale-105">Speichern</p></button
            >
        </div>
    </form>
</div>

<form
    class="hidden"
    action="?/deleteRiege"
    method="POST"
    on:submit={handleDelete}
/>

{#if preview}
    <RiegeModal
        on:click_outside={togglePreview}
        on:close={handleClose}
        name={riege.name}
        trainingszeiten={riege.trainingszeiten}
        age={riege.age}
        description={riege.description}
        riegeId={riege.id}
        personen={riege.person}
        images={riege.image}
    />
{/if}

<style>
    input[type="text"],
    textarea {
        @apply w-full;
    }
</style>
