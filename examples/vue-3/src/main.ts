import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'

const pinia = createPinia().use(PersistedState)

createApp(App).use(pinia).mount('#app')
