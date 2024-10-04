<script setup lang="ts">
async function goToLogin() {
  await navigateTo('/login')
}
</script>

<template>
  <main>
    <h1>home page</h1>
    <button @click="goToLogin">
      To Login Page
    </button>
  </main>
</template>
