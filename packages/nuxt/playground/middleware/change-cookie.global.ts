/* eslint-disable no-console */
/* eslint-disable n/prefer-global/process */
export default defineNuxtRouteMiddleware(() => {
  if (process.client)
    return
  const preset_cookie = usePresetCookie()
  console.log(toRaw(preset_cookie.$state))
  preset_cookie.setToken()
  console.log(toRaw(preset_cookie.$state))
  persistCookie(preset_cookie, ['access_token'])
})
