<template>
    <div class="font-title text-white w-full h-screen" v-if="tab_state">
        <div class="w-3/4 md:w-5/8 bg-zinc-700 h-16 pt-4" style="float:right;">
            <span class="text-2xl ml-4">{{ tab_state }}</span>
        </div>
        <div class="flex flex-row w-full">
            <div class="bg-zinc-500 fixed top-0 left-0 h-full w-1/4 md:w-3/8 px-2 pt-2">
                <RouterLink to="/me"><i class="fa-solid fa-close fa-2xl"></i></RouterLink>
                <div v-for="tab in tab_states" @click="tab_state = tab" class="w-full bg-zinc-600 p-2 rounded hover:drop-shadow-xl hover:bg-zinc-700 transition-all mb-1" style="text-align:center;">
                    {{ tab }}
                </div>
            </div>
            <div class="bg-zinc-500 h-full w-1/4 md:w-3/8 px-1 pt-2">
            </div>
            <div class="w-full w-3/4 md:w-5/8" style="float:right;">
                <div v-if="tab_state == tab_states.account" class="p-2">
                    <button @click="logout().then(()=>{reload_page()}).catch(()=>{reload_page()})" class="bg-red-500 p-2 hover:bg-red-400 rounded transition-all">Logout</button>
                </div>
                <div v-else-if="tab_state == tab_states.profile">
            
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { user, logout } from '../services/UserService';
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
const badges = ref(<any>[]);
const tab_state = ref();
const router = useRouter();
const tab_states = {
    account: "Account",
    profile: "Profile"
};
onMounted(async()=>{
    if(user == null){
        router.push("/")
    }
    tab_state.value = tab_states.account;
})
function reload_page() {
    window.location.reload();
}
</script>