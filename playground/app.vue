<script setup lang="ts">
const cookieStore = useCookieStore()
const localStorageStore = useLocalStorageStore()
const sessionStorageStore = useSessionStorageStore()
</script>

<template>
  <main>
    <label>
      {{ cookieStore.$id }}
      <input v-model="cookieStore.username">
    </label>
    <label>
      {{ localStorageStore.$id }}
      <input v-model="localStorageStore.username">
    </label>
    <label>
      {{ sessionStorageStore.$id }}
      <input v-model="sessionStorageStore.username">
    </label>
  </main>
</template>
