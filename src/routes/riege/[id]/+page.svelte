<script lang="ts">
  import type { PageData } from "../$types";
  import { onMount } from "svelte";
  import RiegeModal from "$lib/components/RiegeModal.svelte";
  import { tick } from "svelte";
  import { currentPage } from "$lib/scripts/stores";
  import IntersectionObserver from "$lib/components/IntersectionObserver.svelte";
  import { enhance, deserialize, applyAction } from "$app/forms";

  export let data: PageData;
  $: ({ riege } = data);
  let additionalLeiter = [false, false, false, false];

  let weekdays: Weekday[] = [];
  let additionalTrainingszeit = false;
  let personen: Person[] = [];
  let preview = false;
  let galery: Galery;
  let previewImages: number[] = [];
  let selectedImages: number[] = [];

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
      confirm("Möchtest du die Riege " + riege.name + " wirklich löschen? ")
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
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const response = await fetch(
        "/api/v1/main/galery/getImages/" + riege.galeryId
      );
      const data = await response.json();

      galery = data.galery;
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const response = await fetch("/api/v1/main/getPersonen");
      const data = await response.json();

      personen = data.personen;

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

    handleImageUpdate();
    adjustAllTextareas();
  });

  function handleImageUpdate() {
    console.log("imageupdate called");
    if (riege?.imageRiege && galery?.image) {
      galery.image.forEach((galeryImage, index) => {
        if (
          riege.imageRiege.some(
            (riegeImage) => riegeImage.image.id === galeryImage.id
          )
        ) {
          previewImages.push(index);
          selectedImages.push(galeryImage.id);
        }
      });

      previewImages = previewImages;
      selectedImages = selectedImages;
    }
  }

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

<svelte:head>
  <title>Riegen</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-10">
  <h1>{riege.name} bearbeiten</h1>

  <div class="flex items-center">
    <a href="/riege">
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
        on:click={() => {
          $currentPage = 3;
        }}
        class="bg-tvblue hover:bg-tvbluelight py-2 px-3 rounded-md text-white group"
      >
        <a href="/galery">
          <p class="group-hover:scale-105">Fotos hochladen</p>
        </a>
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
  <form
    action="?/updateRiege"
    method="POST"
    enctype="multipart/form-data"
    use:enhance
  >
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
          <input type="time" name="from2" id="from2" autocomplete="off" />

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
              <option value={person.id}>{person.firstName} {person.name}</option
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
    personen={riege.person}
    images={riege.image}
  />
{/if}

{#if galery}
  <div class="mt-12"></div>
  <h2>{galery.name}</h2>

  <ul
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 grid-rows-auto"
  >
    {#each galery.image as photo, i}
      <li class="relative hover:scale-102 h-48">
        <IntersectionObserver animation="fade-in">
          <div>
            <img
              loading="lazy"
              class="block h-48 w-full rounded-md shadow-md object-cover object-center"
              src={photo.url}
              alt=""
            />
          </div>
          <div
            class="opacity-0 pointer-events-none !hover:opacity-100 w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-3xl text-white bold"
          >
            vergrössern
          </div>
        </IntersectionObserver>

        <form
          action="?/updateImage"
          method="POST"
          use:enhance={({ formData }) => {
            const index = previewImages.indexOf(i);

            if (index !== -1) {
              previewImages.splice(index, 1);
              selectedImages.splice(index, 1);
              previewImages = previewImages;
              selectedImages = selectedImages;
            } else {
              previewImages.push(i);
              selectedImages.push(galery.image[i].id);
              if (previewImages.length > 3) {
                previewImages.shift();
                selectedImages.shift();
              }
              previewImages = previewImages;
              selectedImages = selectedImages;
            }

            selectedImages.forEach((image, index) => {
              formData.append(`img${index + 1}`, String(image));
            });
          }}
        >
          <button
            class={previewImages.indexOf(i) == -1
              ? "absolute inset-0 transition duration-100 group hover:bg-blue-500 hover:bg-opacity-50 rounded-md"
              : "absolute inset-0 transition duration-100 group bg-blue-500 bg-opacity-50 rounded-md"}
          >
            <div
              class={previewImages.indexOf(i) == -1
                ? "hidden"
                : "flex justify-center items-center relative"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="65"
                viewBox="0 -960 960 960"
                width="65"
                class="fill-white"
              >
                <path
                  d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
                />
              </svg>
            </div>
            <div
              class={previewImages.indexOf(i) == -1
                ? "hidden"
                : "absolute top-5 left-0 right-0 text-white font-black text-3xl"}
            >
              {previewImages.indexOf(i) + 1}
            </div>
          </button>
        </form>
      </li>
    {/each}
  </ul>
{/if}

<style>
  input[type="text"],
  textarea {
    @apply w-full;
  }
</style>
