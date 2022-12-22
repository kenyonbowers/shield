<template>
    <button @click="logout().then(()=>{reloadPage()}).catch(()=>{reloadPage()})">Logout</button>
    <img v-for="badge in badges" />
</template>
<script setup lang="ts">
import { user, logout, getUserBadges } from '../services/UserService';
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
const badges = ref(<any>[]);
const router = useRouter();
onMounted(async()=>{
    if(user == null){
        router.replace("/")
    }
})
function reloadPage() {
    window.location.reload();
}
</script>