<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    let weekdays: Weekday[] = [];

    let showInputFields: boolean[] = [];

    let updateElement: HTMLFormElement;
    let deleteElement: HTMLFormElement;
    let deleteWeekday = 0;

    onMount(async () => {
        try {
            const response = await fetch("/api/v1/main/getWeekdays");
            const data = await response.json();

            weekdays = data.weekdays;
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

    async function handleDelete() {
        if (
            confirm(
                "Möchtest du " +
                    weekdays[deleteWeekday].name +
                    " wirklich löschen?"
            )
        ) {
            deleteElement.submit();
        }
    }
</script>

<h1>Wochentage</h1>

<p>Änderungen benötigen 3 Stunden, bis sie ersichtlich sind.</p>
<div class="mb-5"></div>

<svelte:window on:click={handleClickOutside} />

<form action="?/createWeekday" method="POST" class="w-80">
    <input
        type="text"
        name="weekday"
        id="weekday"
        placeholder="neuer Tag"
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
    {#each weekdays as weekday, i}
        <li in:slide class="flex h-10 w-80 my-1">
            {#if showInputFields[i] == true}
                <form
                    action="?/updateWeekday"
                    method="POST"
                    class="flex -mt-2"
                    bind:this={updateElement}
                >
                    <input
                        type="text"
                        bind:value={weekday.name}
                        name="role"
                        class="w-full"
                    />
                    <input
                        hidden
                        type="number"
                        name="id"
                        bind:value={weekday.id}
                    />

                    <button
                        class="ml-1 mb-2 bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
                        type="submit"
                    >
                        <p class="group-hover:scale-105">Speichern</p>
                    </button>
                </form>

                <form
                    action="?/deleteWeekday"
                    method="POST"
                    class="group ml-3 -mr-6"
                    on:submit|preventDefault={() => {
                        deleteWeekday = i;
                        handleDelete();
                    }}
                    bind:this={deleteElement}
                >
                    <input
                        hidden
                        type="number"
                        name="id"
                        bind:value={weekday.id}
                    />
                    <button class="flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 -960 960 960"
                            width="24"
                            class="fill-red-500 group-hover:scale-110"
                        >
                            <path
                                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                            />
                        </svg>
                    </button>
                </form>
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
                                    {weekday.name}
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
