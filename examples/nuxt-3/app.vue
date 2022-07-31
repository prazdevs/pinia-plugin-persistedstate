<script setup lang="ts">
const userStore = useUserStore()
</script>

<template>
  <div>
    <input v-model="userStore.username" />
  </div>
</template>
