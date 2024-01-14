<script>
    import Loader from "$lib/components/Loader.svelte";
    import { onMount } from "svelte";
    let mounted = false;
    let count = 3;
    const countdown = setInterval(() => {
        count--;
        if (count === 0) {
            clearInterval(countdown);
            if (mounted) {
                window.location.href = "/";
            }
        }
    }, 1000);

    onMount(() => {
        mounted = true;
    });
</script>

<title>TV Nussbaumen</title>

<h1 class="h1 flex place-content-center">Seite nicht gefunden :(</h1>

<div class="h4 flex place-content-center pt-5">Du wirst weitergeleitet in</div>

<div class="h2 flex place-content-center pt-5">{count}</div>

<div class="flex justify-center">
    <img
        loading="lazy"
        class="h-96"
        src="/images/gif/runnerColor.gif"
        alt="athlete running gif"
    />
</div>
