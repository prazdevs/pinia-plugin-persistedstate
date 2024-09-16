<script setup lang="ts">
const cookieStore = useCookieStore()
const localStorageStore = useLocalStorageStore()
const sessionStorageStore = useSessionStorageStore()
</script>

<template>
  <main>
    <label for="cookie">{{ cookieStore.$id }}</label>
    <input id="cookie" v-model="cookieStore.username">
    <label for="local">{{ localStorageStore.$id }}</label>
    <input id="locale" v-model="localStorageStore.username">
    <label for="session">{{ sessionStorageStore.$id }}</label>
    <input id="session" v-model="sessionStorageStore.username">
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  padding: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
}

label {
  margin: auto 0 auto auto;
}

input {
  border-radius: 5px;
  border-width: 2px;
  border-style: solid;
  border-color: #585b70;
  background-color: transparent;
  color: inherit;
  font-size: inherit;
}

input:focus-visible {
  outline: #cba6f7 2px solid;
}
</style>
