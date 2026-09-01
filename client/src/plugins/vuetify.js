import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const bahsTheme = {
  dark: false,
  colors: {
    primary: '#1976d2',
    secondary: '#26a69a',
    accent: '#9c27b0',
    error: '#c10015',
    info: '#31ccec',
    success: '#21ba45',
    warning: '#f2c037',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'bahsTheme',
    themes: {
      bahsTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})

