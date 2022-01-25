import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { initializeApp } from "firebase/app"

//// Firebase設定
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJ7eZNUrXxH_i0_T95SVBTtB_3wA_RWRQ",
    authDomain: "vue3-sample-595d9.firebaseapp.com",
    databaseURL: "https://vue3-sample-595d9-default-rtdb.firebaseio.com",
    projectId: "vue3-sample-595d9",
    storageBucket: "vue3-sample-595d9.appspot.com",
    messagingSenderId: "736416158919",
    appId: "1:736416158919:web:04020d0044b8a249b19ae2"
  };
  
// Initialize Firebase
initializeApp(firebaseConfig)

//// App設定
createApp(App).mount('#app')
