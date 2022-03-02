<script setup lang="ts">
import { useUserStore } from './stores/user'

const userStore = useUserStore()
</script>

<template>
  <div>
    <input v-model="userStore.username" />
  </div>
</template>
