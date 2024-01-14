<script>
    import { onMount } from "svelte";

    let roles = [];
    let isLoading = true;
    let isVorstand = false;
    let isLeiter = false;
    let riegen = [];

    onMount(async () => {
        try {
            const response = await fetch("/api/v1/main/getRoles");
            const data = await response.json();
            roles = data.roles;

            isLoading = false;
        } catch (error) {
            console.error("Error:", error);
        }
        try {
            const response = await fetch("/api/v1/main/getRiegen");
            const data = await response.json();
            riegen = data.riegen;

            isLoading = false;
        } catch (error) {
            console.error("Error:", error);
        }
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        formData.set(
            "isVorstand",
            formData.get("isVorstand") === "on" ? "true" : "false"
        );

        const response = await fetch("?/createPerson", {
            method: "POST",
            body: formData,
        });

        if (response.status !== 200) {
            console.error("Error:", response);
            return;
        }
        window.location.href = "/person";
    };
</script>

<div class="mb-10">
    <h1>Person erstellen</h1>

    <div class="flex items-center">
        <a class="flex mb-3" href="/person">
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

    <form action="?/createPerson" method="POST" on:submit={handleSubmit}>
        <div class="mb-2">
            <label for="firstName">Vorname</label>
            <input
                type="text"
                name="firstName"
                id="firstName"
                required
                autocomplete="off"
            />
        </div>
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
        <div class="mb-2">
            <label for="email">Email</label>
            <input
                type="email"
                name="email"
                id="email"
                required
                autocomplete="off"
            />
        </div>
        <div class="mb-2">
            <label for="isVorstand">Vorstandsmitglied</label>
            <input
                type="checkbox"
                name="isVorstand"
                id="isVorstand"
                bind:checked={isVorstand}
            />
        </div>
        <div class="mb-2">
            {#if isVorstand}
                <label for="role">Rolle</label>
                <select id="role" name="role">
                    {#each roles as role (role.id)}
                        <option value={role.id}>{role.name}</option>
                    {/each}
                </select>
            {/if}
        </div>
        <div class="mb-2">
            <label for="isLeiter">Leiter</label>
            <input
                type="checkbox"
                name="isLeiter"
                id="isLeiter"
                bind:checked={isLeiter}
            />
        </div>
        <div class="mb-2">
            {#if isLeiter}
                <label for="riege">Riegen</label>
                <select id="riege" name="riege">
                    {#each riegen as riege (riege.id)}
                        <option value={riege.id}>{riege.name}</option>
                    {/each}
                </select>
            {/if}
        </div>

        <div class="mb-2">
            <label for="image">Avatar</label>
            <input
                type="file"
                id="image"
                name="image"
                accept=".jpg, .jpeg, .png, .webp"
                required
            />
        </div>

        <div
            class="bg-tvblue hover:bg-tvbluelight w-min rounded-md px-3 py-2 text-white group"
        >
            <button class="" type="submit">
                <p class="flex group-hover:scale-105">Speichern</p></button
            >
        </div>
    </form>
</div>
