<script>
    import { onMount } from "svelte";

    let posts = [];

    onMount(async () => {
        try {
            const response = await fetch("/api/v1/main/getPosts");
            const data = await response.json();

            posts = data.posts;
        } catch (error) {
            console.error("Error:", error);
        }
    });
</script>

<h1>Beiträge Verwalten</h1>

<div class="flex mb-3">
    <a class="flex group hover:text-gray-500" href="/post/create">
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

        <div class="group-hover:scale-105">Beitrag erstellen</div>
    </a>
</div>

<ul class="grid grid-cols-3">
    {#each posts as post}
        <li class="relative rounded-lg shadow-lg group">
            <a href={"/post/" + post.id}>
                <img class="rounded-t-lg" src={post.image.url} alt="" />
                <div class="p-2 text-center">
                    <h4>
                        {post.title}
                    </h4>
                    <p>
                        {post.text}
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
            </a>
        </li>
    {/each}
</ul>
