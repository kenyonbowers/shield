<template>
    <div class="flex flex-row w-full h-full p-6 gap-4 font-title text-white" v-if="servers">
        <RouterLink v-for="srvr in servers" :to="`/i/${srvr.id}`" class="flex flex-col justify-center gap-2">
            <div class="w-full flex justify-center">
                <img :src="`https://shield.pockethost.io/api/files/servers/${srvr.id}/${srvr.icon}`" class="min-w-20 min-h-20 w-20 h-20 max-w-20 max-h-20 rounded-xl transition-all hover:drop-shadow-xl"/>
            </div>
            <div class="w-full flex justify-center">
                <span class="text-lg">{{ srvr.name }}</span>
            </div>
        </RouterLink>
    </div>
</template>
<script setup lang="ts">
import { getAllServers } from '../../user/services/UserService'
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { user } from '../../user/services/UserService';
const router = useRouter();
const servers = ref();
onMounted(async()=>{
    if(user == null){
        router.push("/")
    }
    servers.value = await getAllServers();
});
</script>