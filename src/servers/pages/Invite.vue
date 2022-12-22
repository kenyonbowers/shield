<template>
    <div class="flex justify-center w-full h-full font-title text-white" v-if="server_icon">
        <div class="flex flex-col justify-center mt-64 md:mt-96 gap-2">
            <div class="w-full flex justify-center">
                <img :src="server_icon" class="min-w-32 min-h-32 w-32 h-32 max-w-32 max-h-32 rounded-xl"/>
            </div>
            <div class="w-full flex justify-center">
                <span class="text-3xl">{{ server_name }}</span>
            </div>
            <div class="flex flex-row gap-2 w-full flex justify-center">
                <RouterLink to="/me"><button class="bg-zinc-500 hover:bg-zinc-400 transition-all pl-4 pr-4 pt-2 pb-2 rounded text-lg">Cancel!</button></RouterLink>
                <button @click="click()" class="bg-blue-500 hover:bg-blue-400 transition-all pl-4 pr-4 pt-2 pb-2 rounded text-lg">Join!</button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { getServer, joinServer } from '../../user/services/UserService';
import Config from '../../config/services/ConfigService';
const route = useRoute();
const router = useRouter();
const server_id = ref();
const server_icon = ref();
const server_name = ref();
onMounted(async()=>{
    let { id } = route.params
    server_id.value = id;
    var server = await getServer(server_id.value);
    server_icon.value = Config.pocketBaseApiUrl + "api/files/servers/" + server_id.value + "/" + server.icon;
    server_name.value = server.name;
});

async function click(){
    var status_code:any = await joinServer(server_id.value);
    if(status_code == true){
        router.push("/me");
    }
}
</script>