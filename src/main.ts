import { createApp } from 'vue'
import './style.css'
import VueApp from './App.vue'
import router from './router'

const app = createApp(VueApp)
app.use(router)
app.mount('#app')

//import { App } from '@capacitor/app';

/*App.addListener('backButton', data => {
    window.history.back();
})*/