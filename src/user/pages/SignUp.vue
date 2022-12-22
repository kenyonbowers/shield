<template>
    <h1>Signup</h1>
    <input class="border-black border-2" placeholder="Username" v-model="username_model"/>
    <input class="border-black border-2" placeholder="Password" type="password" v-model="password_model"/>
    <input class="border-black border-2" placeholder="Confirm Password" type="password" v-model="password_confirm_model"/>
    <input class="border-black border-2" placeholder="Email" type="email" v-model="email_model"/>
    <button @click="signup(username_model, password_model, password_confirm_model, email_model).then(()=>{reloadPage()})">Login!</button>
</template>
<script setup lang="ts">
import { user, signup } from '../services/UserService';
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
const username_model = ref("");
const password_model = ref("");
const password_confirm_model = ref("");
const email_model = ref("");
const router = useRouter();
onMounted(async()=>{
    console.log(user)
    if(user != null){
        router.replace("/me")
    }
})
function reloadPage() {
    window.location.reload();
}
</script>