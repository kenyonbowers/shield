<template>
    <div class="w-full h-screen flex justify-center font-title text-white">
        <div class="flex items-center h-full" style="text-align:center;">
            <div class="flex flex-col gap-2">
                <div class="flex items-center flex-col mb-2">
                    <img src="/icon.png" class="w-24 h-24 rounded-lg"/>
                    <p class="text-2xl">Shield</p>
                </div>
                <div class="flex flex-row gap-2">
                    <RouterLink to="/login" class="self-center bg-blue-500 p-2 rounded w-20">Login</RouterLink>
                    <RouterLink to="/signup" class="self-center bg-zinc-500 p-2 rounded w-20">Sign Up</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { user } from '../../user/services/UserService';
import { useRouter } from "vue-router"
import Config from '../../config/services/ConfigService';
const router = useRouter();
if(user != null){
    router.replace(Config.appUrl)
}
</script>