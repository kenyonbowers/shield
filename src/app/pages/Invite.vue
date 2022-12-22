<template>
    <button @click="click()">Join!</button>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { joinServer } from '../../user/services/UserService';
const route = useRoute();
const router = useRouter();
const server_id = ref();
onMounted(async()=>{
    let { id } = route.params
    server_id.value = id;
});

async function click(){
    var status_code:any = await joinServer(server_id.value);
    if(status_code == true){
        router.replace("/me");
    }
}
</script>