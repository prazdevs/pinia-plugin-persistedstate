<script setup>
const local = useLocalUser()
const cookie = useCookieUser()
const preset_cookie = usePresetCookie()
</script>

<template>
  <div>
    <span>Local:</span>
    <input v-model="local.username">
  </div>
  <div>
    <span>Cookie:</span>
    <input v-model="cookie.username">
  </div>
  <div>
    <span>UserAgent:</span>
    <input v-model="preset_cookie.token" readonly>
  </div>
</template>
