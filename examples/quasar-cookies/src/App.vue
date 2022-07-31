<template>
  <input v-model="userStore.username" />
  <button @click="() => userStore.$hydrate()">hydrate</button>
</template>

<script setup lang="ts">
import { useUserStore } from './stores/user-store.js';
const userStore = useUserStore()
</script>
