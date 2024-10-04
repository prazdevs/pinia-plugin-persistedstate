<script setup lang="ts">
const tokenStore = useTokenStore()

async function login() {
  tokenStore.token = 'loginToken'
  await navigateTo('/page')
}
</script>

<template>
  <main>
    <h1>Login page</h1>
    <button @click="login">
      Login
    </button>
  </main>
</template>
