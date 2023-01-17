<template>
    <div class="w-full h-screen flex justify-center font-title text-white">
        <div class="fixed top-0 left-0 p-4">
            <RouterLink to="/"><i class="fa-solid fa-arrow-left fa-2xl"></i></RouterLink>
        </div>
        <div class="flex items-center h-full" style="text-align:center;">
            <div class="flex flex-col gap-2">
                <div class="flex items-center flex-col mb-2">
                    <p class="text-2xl underline">Signup</p>
                </div>
                <div class="flex flex-col gap-2 text-black">
                    <input class="border-black border-2 p-1" placeholder="Username" v-model="username_model"/>
                    <input class="border-black border-2 p-1" placeholder="Password" type="password" v-model="password_model"/>
                    <input class="border-black border-2 p-1" placeholder="Confirm Password" type="password" v-model="password_confirm_model"/>
                    <input class="border-black border-2 p-1" placeholder="Email" type="email" v-model="email_model"/>
                    <button @click="signup(username_model, password_model, password_confirm_model, email_model).then(()=>{reloadPage()})" class="self-center bg-blue-500 p-2 rounded w-20 text-white">Signup!</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { user, signup } from '../services/UserService';
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
import Config from '../../config/services/ConfigService';
const username_model = ref("");
const password_model = ref("");
const password_confirm_model = ref("");
const email_model = ref("");
const router = useRouter();
onMounted(async()=>{
    if(user != null){
        router.push(Config.appUrl)
    }
})
function reloadPage() {
    window.location.reload();
}
</script>