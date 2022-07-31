import { boot } from "quasar/wrappers";
import { Cookies } from "quasar";
import { 
  createQuasarCookiesPersistedState 
} from "pinia-plugin-persistedstate/quasar";

export default boot(({ store, ssrContext }) => {
  store.use(createQuasarCookiesPersistedState(Cookies, ssrContext));
});
