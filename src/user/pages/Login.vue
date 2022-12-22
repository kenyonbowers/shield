<template>
    <h1>Login</h1>
    <input class="border-black border-2" placeholder="Email" type="email" v-model="email_model"/>
    <input class="border-black border-2" placeholder="Password" type="password" v-model="password_model"/>
    <button @click="login(email_model, password_model).then(()=>{reloadPage()})">Login!</button>
</template>
<script setup lang="ts">
import { user, login } from '../services/UserService';
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
const router = useRouter();
onMounted(async()=>{
    if(user != null){
        router.push("/me")
    }
})
const email_model = ref("");
const password_model = ref("");
function reloadPage() {
    window.location.reload();
}
</script>