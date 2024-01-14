<script>
    import { onMount } from "svelte";

    let personen = [];
    let filter = "";

    onMount(async () => {
        try {
            const response = await fetch("/api/v1/main/getPersonen");
            const data = await response.json();

            personen = data.personen;
        } catch (error) {
            console.error("Error:", error);
        }
    });

    async function getPersonen() {
        if (filter.length > 0) {
            try {
                const response = await fetch(
                    "/api/v1/main/getPersonen/" + filter
                );
                const data = await response.json();

                personen = data.personen;
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            try {
                const response = await fetch("/api/v1/main/getPersonen");
                const data = await response.json();

                personen = data.personen;
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }
</script>

<h1>Personen Verwalten</h1>

<div class="flex mb-3">
    <a class="flex group hover:text-gray-500" href="/person/create">
        <svg
            class="group-hover:scale-110 group-hover:fill-gray-500 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            ><path
                d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
            /></svg
        >

        <div class="group-hover:scale-105">Person erstellen</div>
    </a>
</div>

<div class="mb-5 relative transition-all">
    <input
        type="text"
        id="name"
        name="name"
        class="flex-grow pl-8"
        bind:value={filter}
        on:keydown={getPersonen}
        autocomplete="off"
        placeholder="Person suchen"
    />

    <div class={"absolute transform -translate-y-1/2 top-1/2 left-2 flex"}>
        <svg
            class="fill-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 -960 960 960"
            width="20"
        >
            <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
            />
        </svg>
    </div>
    {#if filter}
        <button
            class="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-md group text-sm ml-1"
            on:click={() => {
                filter = "";
                getPersonen();
            }}
        >
            <p class="group-hover:scale-105">zurücksetzen</p>
        </button>
    {/if}
</div>

<div class="">
    <div
        class="grid gap-5 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 justify-between"
    >
        {#each personen as person}
            <div class="flex justify-center">
                <a href={"/person/" + person.id} class="group">
                    <div
                        class="relative group-hover:scale-102 transition-all duration-100"
                    >
                        <div
                            class="flex justify-center absolute bottom-2 left-0 right-0"
                        >
                            <p
                                class="text-center bg-black bg-opacity-80 rounded-md px-3 py-2 items-center text-white text-xs"
                            >
                                {person.firstName}
                                {person.name}
                            </p>
                        </div>
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
                        <img
                            height="180"
                            width="180"
                            class="rounded-lg shadow-md"
                            src={person.avatar.url +
                                "?h=180&w=180&crop=faces&lossless=false&auto=compress&fit=crop&fm=webp"}
                            alt=""
                        />
                    </div>
                </a>
            </div>
        {/each}
    </div>
</div>
