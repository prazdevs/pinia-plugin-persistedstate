import { defineStore } from 'pinia';
import { Cookies } from 'quasar'

export const useUserStore = defineStore('counter', {
  state: () => ({
    username: 'PraZ',
  }),
  persist: true,
});
