<script lang="ts">
    import type { PageData } from "../$types";
    import { onMount } from "svelte";
    import { BlobServiceClient } from "@azure/storage-blob";

    let isLoading = true;
    let weekdays = [];
    let additionalTrainingszeit = false;
    let personen = [];
    let riegen = [];
    let additionalLeiter = [true, false, false, false];
    let galeries: Galery[] = [];

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
            const response = await fetch("/api/v1/main/galery");
            const data = await response.json();

            galeries = data.galeries;
            console.log;

            isLoading = false;
        } catch (error) {
            console.error("Error:", error);
        }
        try {
            const response = await fetch("/api/v1/main/getPersonen");
            const data = await response.json();

            personen = data.personen;

            isLoading = false;
        } catch (error) {
            console.error("Error:", error);
        }
    });

    function toggleTrainingszeit() {
        if (additionalTrainingszeit) {
            additionalTrainingszeit = false;
        } else {
            additionalTrainingszeit = true;
        }
    }

    function adjustHeight(event) {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + 15 + "px";
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const response = await fetch("?/createRiege", {
            method: "POST",
            body: formData,
        });

        if (response.status !== 200) {
            console.error("Error:", response);
            return;
        }
        window.location.href = "/riege";
    };
</script>

<div class="mb-10">
    <h1>Riege erstellen</h1>

    <div class="flex items-center">
        <a class="flex mb-3" href="/riege">
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
    </div>

    <form
        action="?/createRiege"
        method="POST"
        enctype="multipart/form-data"
        on:submit={handleSubmit}
    >
        <div class="mb-2">
            <label for="name">Name</label>
            <input
                type="text"
                name="name"
                id="name"
                required
                autocomplete="off"
            />
        </div>

        <div>
            <label for="description">Beschreibung</label>
            <textarea
                name="description"
                id="description"
                required
                autocomplete="off"
                on:input={adjustHeight}
            />
        </div>

        <div class="mb-2">
            <label for="age">Alter</label>
            <input type="text" name="age" id="age" autocomplete="off" />
        </div>

        <div class="flex items-center space-x-2">
            <label for="from">Von</label>
            <input type="time" name="from" id="from" autocomplete="off" />

            <label for="to">Bis</label>
            <input type="time" name="to" id="to" autocomplete="off" />

            <label for="weekday">Tag</label>
            <select name="weekday" id="weekday" required>
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

        <div class="my-2" />

        <div class="flex items-center space-x-2 mb-2">
            {#if additionalTrainingszeit}
                <label for="from2">Von</label>
                <input type="time" name="from2" id="from2" autocomplete="off" />

                <label for="to2">Bis</label>
                <input type="time" name="to2" id="to2" autocomplete="off" />

                <label for="weekday">Tag</label>
                <select name="weekday2" id="weekday2" required>
                    {#each weekdays as weekday}
                        <option value={weekday.id}>{weekday.name}</option>
                    {/each}
                </select>

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
                    <select name="personId{i}" id="personId{i}" required>
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

        <div>
            <select name="galery" id="galery" required>
                {#each galeries as galery}
                    <option value={galery.id}>{galery.name} </option>
                {/each}
            </select>
        </div>

        <div>
            <button
                class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
                type="submit"
            >
                <p class="group-hover:scale-105">Speichern</p>
            </button>
        </div>
    </form>
</div>

<style>
    input[type="text"],
    textarea {
        @apply w-full;
    }
</style>
