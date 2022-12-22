<template>
    <div class="font-title text-white w-full h-screen">
        <div v-if="server && channel" class="w-3/4 bg-zinc-700 h-16 pt-5" style="float:right; text-align:center;">
            {{ server.name }} : {{ channel.name }}
        </div>
        <div class="flex flex-row w-full">
            <div class="bg-zinc-500 fixed top-0 left-0 h-full w-1/4 pl-4 pt-2">
                <div v-for="chnl in channels">
                    <button @click="changeChannels(chnl)">{{ chnl.name }}</button>
                </div>
            </div>
            <div class="bg-zinc-500 h-full w-1/4 pl-4 pt-2">
            </div>
            <div id="msg_viewer">
                <div v-for="msg in messages" :key="msg.id" :id="msg.id" class="flex p-2" style="jusify-content:left;">
                    <img :src="`https://shield.pockethost.io/api/files/users/${msg.expand.user.id+'/'+msg.expand.user.avatar}`" class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <div class="ml-2">
                        <div class="text-sm">
                            {{ msg.expand.user.username }}
                        </div>
                        <span class="text-lg ml-2 break-all">{{ msg.text }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="scroll" class="h-32 md:h-48 w-3/5" style="float:right;"></div>
        <div class="w-full p-2 fixed bottom-0 left-0 bg-zinc-700 flex flex-col h-32 md:h-48">
            <div class="w-full flex justify-center flex-row gap-2 mb-2">
                <div v-for="srvr in servers" @click="changeServer(srvr)" :key="srvr.id" :id="srvr.id">
                    <img v-if="srvr.id == server.id" :src="`https://shield.pockethost.io/api/files/servers/${srvr.id}/${srvr.icon}`" class="min-w-12 min-h-12 max-w-12 max-h-12 rounded"/>
                    <img v-else :src="`https://shield.pockethost.io/api/files/servers/${srvr.id}/${srvr.icon}`" class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full"/>
                </div>
            </div>
            <div class="w-full flex justify-center">
                <input v-model="input_field" class="border-2 border-none rounded text-black w-11/12 p-4"/>
                <button class="ml-2 bg-blue-500 rounded pl-2 pr-2 border-none" @click="$event.preventDefault; sendMessage({ text: input_field, user: user?.id, channel: channel.id })">Send!</button>
            </div>
        </div>
        
    </div>
</template>
<script setup lang="ts">
import { user, getMessages, sendMessage, getServers } from '../../user/services/UserService';
import { useRouter } from "vue-router";
import { onMounted, onDeactivated, ref } from 'vue';
import client from '../../api/PocketBaseClient';
const router = useRouter();

let unsubscribe: () => void;

const messages = ref(<any>[]);
const input_field = ref();
const server = ref();
const servers = ref(<any>[]);
const channel = ref();
const channels = ref(<any>[]);

onMounted(async()=>{
    if(user == null){
        router.replace("/")
    }
    (await getServers()).items.forEach(el => {
        servers.value.push(el);
    });
    server.value = servers.value[0];
    changeServer(server.value);
    unsubscribe = await client.collection('messages').subscribe("*", async({ action, record }) => {
        if(action == "create"){
            const msg_user = await client.collection("users").getOne(record.user);
            record.expand = { user: msg_user }
            messages.value = [...messages.value, record];
            if(msg_user.id == user?.id){
                setTimeout(function(){
                    document.getElementById("scroll")?.scrollIntoView({behavior: "smooth", block: "start", inline: "center"});
                }, 500)
            }
        }
        else if(action == "delete"){
            console.log(messages.value.filter((msg:any) => msg.id !== record.id))
            messages.value = messages.value.filter((msg:any) => msg.id !== record.id)
        }
        else if(action == "update"){
            var index = messages.value.findIndex((msg:any)=>{
                return msg.id == record.id
            })
            messages.value[index].text = record.text;
        }
    })
})
onDeactivated(async()=>{
    unsubscribe();
})

async function changeServer(srvr:any){
    server.value = srvr;
    channels.value = [];
    server.value.expand.channels.forEach((el:any) => {
        channels.value.push(el);
    });
    changeChannels(channels.value[0]);
}
async function changeChannels(chnl:any){
    messages.value = [];
    channel.value = chnl;
    (await getMessages(1, 20, channel.value.id)).items.forEach(el => {
       messages.value.push(el); 
    });
    messages.value.reverse();
}
</script>
<style setup lang="css">
body{
    background-color: rgb(82 82 91);
}
</style>