<script>
    import { onMount } from "svelte";

    let roles = [];

    onMount(async () => {
        try {
            const response = await fetch("/api/v1/main/getRoles");
            const data = await response.json();

            console.log(data);
            roles = data.roles;

            console.log(roles);
        } catch (error) {
            console.error("Error:", error);
        }
    });
</script>

{#each roles as role}
    <div>
        {role.name}
    </div>
{/each}
