import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VBtn } from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
// import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { theme } from '@/plugins/vuetify/theme'
import defaults from '@/plugins/vuetify/defaults'
import { icons } from '@/plugins/vuetify/icons.js'

// style
import 'vuetify/styles' // Vuetify basic styling
import '@core/scss/template/libs/vuetify/index.scss' // Custom styling

export default createVuetify({
  components,
  labsComponents,
  theme,
  directives,
  defaults,
  icons,
  aliases: {
    IconBtn: VBtn,
  },
  // icons: {
  //   defaultSet: 'mdi',
  //   aliases,
  //   sets: { mdi },
  // },
})
