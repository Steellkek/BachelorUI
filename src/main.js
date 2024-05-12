import { createApp } from 'vue'
import App from './App.vue'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue3-easy-data-table/dist/style.css';
import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select'

createApp(App).component('v-select', vSelect).mount('#app')
