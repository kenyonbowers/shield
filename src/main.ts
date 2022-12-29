import { createApp } from 'vue'
import './style.css'
import VueApp from './App.vue'
import router from './router'
import vfmPlugin from 'vue-final-modal'

const app = createApp(VueApp)
//@ts-expect-error
app.use(vfmPlugin)
app.use(router)
app.mount('#app')

import { App } from '@capacitor/app';

App.addListener('backButton', data => {
    window.history.back()
})