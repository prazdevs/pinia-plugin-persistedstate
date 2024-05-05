import twoslashFloating from '@shikijs/vitepress-twoslash/client'
import theme from 'vitepress/theme'

import '@shikijs/vitepress-twoslash/style.css'
import './vars.css'

export default {
  extends: theme,
  enhanceApp({ app }) {
    app.use(twoslashFloating)
  },
}
