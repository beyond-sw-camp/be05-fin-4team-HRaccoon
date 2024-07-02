import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Lottie from 'vue3-lottie'
import Toast from 'vue-toastification'
import CKEditor from '@ckeditor/ckeditor5-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify/vuetify.js'

// styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'

import 'vue-toastification/dist/index.css'
import { options } from '@/plugins/toastification/toastOption.js'
import { theme } from '@/plugins/vuetify/theme.js'

const app = createApp(App)

// Set CSS variables
const setCSSVariables = theme => {
  const themeColors = theme.themes[theme.defaultTheme].colors
  const root = document.documentElement

  Object.keys(themeColors).forEach(key => {
    root.style.setProperty(`--v-theme-${key}`, themeColors[key])
  })
}

setCSSVariables(theme)

app.use(vuetify)
app.use(router)
app.use(CKEditor)
app.use(Toast, options)
app.use(createPinia().use(piniaPluginPersistedstate))
app.component('LottieAnimation', Vue3Lottie)
app.mount('#app')
