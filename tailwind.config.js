/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
        extend: {
            colors: {
                tvbluelight: "#4569bf",
                tvblue: "#375398",
                tvyellow: "#E3BE53",
            },
            scale: {
                102: "1.02",
            },
            animation: {
                wiggle: "wiggle 1s ease-in-out infinite",
            },
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-5deg)" },
                    "50%": { transform: "rotate(5deg)" },
                },
            },
        },
    },

    future: {
        hoverOnlyWhenSupported: true,
    },

    corePlugins: {
        aspectRatio: false,
    },
    plugins: [require("@tailwindcss/aspect-ratio"), "@tailwindcss/forms"],
};
