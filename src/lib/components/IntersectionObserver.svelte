<script lang="ts">
    import { onMount } from "svelte";

    export let timer: number = 0;
    export let animation:
        | "direction-left"
        | "unblur"
        | "direction-right"
        | "fade-in" = "fade-in";

    let visible = false;

    let observer: IntersectionObserver | null = null;

    function observe(ref: Element) {
        if (ref && IntersectionObserver) {
            observer = new IntersectionObserver(
                ([entry], observer) => {
                    if (entry.isIntersecting) {
                        makeVisible();
                        observer.unobserve(entry.target);
                    }
                },
                { threshold: 0.5, rootMargin: "0px 0px 320px 0px" }
            );
            observer.observe(ref);
        }
    }

    function makeVisible() {
        setTimeout(
            () => {
                visible = true;
            },
            (timer * 1000) / 10
        );
    }

    onMount(() => {
        const elements = document.querySelectorAll(".fly-in");
        elements.forEach((element, index) => {
            (element as HTMLElement).style.transitionDelay = `${index * 100}ms`;
        });
    });
</script>

<div use:observe class={visible ? `visible ${animation}` : "invisible"}>
    <slot />
</div>

<style>
    .visible {
        opacity: 1;
        transform: translateY(0);
    }

    .invisible {
        opacity: 0;
        transform: translateY(100px);
    }

    @keyframes fly-in-left {
        from {
            transform: translateX(-5%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes fly-in-right {
        from {
            transform: translateX(5%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes blur-unblur {
        0% {
            filter: blur(2px);
        }
        100% {
            filter: blur(0);
        }
    }

    .visible.fade-in {
        animation: fade-in 1s ease-out;
    }

    .visible.direction-left {
        animation: fly-in-left 1s ease-out;
    }

    .visible.direction-right {
        animation: fly-in-right 1s ease-out;
    }

    .visible.unblur {
        animation: blur-unblur 1s ease-in-out;
    }
</style>
