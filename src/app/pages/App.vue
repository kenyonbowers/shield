<template>
    <div class="font-title text-white w-full h-screen" v-if="server && servers">
        <div v-if="server && channel" class="w-full md:w-3/4 md:w-5/8 bg-zinc-700 fixed top-0 right-0 h-16 pt-5 z-50"
            style="float:right; text-align:center;">
            <button v-if="breakpoint == 'sm'" @click="mobile_menu_open = true" class="fixed left-6"><i class="fa-solid fa-bars fa-xl"></i></button>
            <Transition v-if="breakpoint == 'sm'">
                <div class="top-nav-menu__mobile-menu-panel transition-all bg-zinc-500 text-white px-4 py-2"
                    v-if="show_mobile_menu_open && breakpoint == 'sm'">
                    <button @click="mobile_menu_open = false" class="fixed top-4 left-6"><i class="fa-solid fa-close fa-2xl"></i></button>
                    <div class="bg-zinc-500 h-full w-full px-2 pt-12 break-all" style="text-align:start;">
                        <div v-for="ctgry in categories" class="mb-2">
                            <span class="font-bold">{{ ctgry.name }}</span>
                            <div v-for="chnl in ctgry.expand.channels">
                                <button @click="change_channels(chnl); mobile_menu_open = false;"><i class="fa-solid fa-bars"></i> {{ chnl.name }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
            <span>{{ server.name }} - {{ channel.name }}</span>
        </div>
        <div class="w-full md:w-3/4 md:w-5/8 h-16">
        </div>
        <div class="flex flex-row w-full z-20">
            <div v-if="breakpoint != 'sm'" class="bg-zinc-500 fixed top-0 left-0 h-full w-1/4 md:w-3/8 px-4 pt-2 break-all">
                <div v-for="ctgry in categories" class="mb-2">
                    <span class="font-bold">{{ format_text(ctgry.name) }}</span>
                    <div v-for="chnl in ctgry.expand.channels">
                        <button @click="change_channels(chnl)"><i class="fa-solid fa-bars"></i> {{ format_text(chnl.name)
                        }}</button>
                    </div>
                </div>
            </div>
            <div v-if="breakpoint != 'sm'" class="bg-zinc-500 h-full w-1/4 md:w-3/8 pl-4 pt-2">
            </div>
            <div id="msg_viewer" class="w-full md:w-3/4 md:w-5/8">
                <div v-for="msg in messages" :key="msg.id" :id="msg.id" class="flex p-2 hover:bg-zinc-500 transition-all w-full" @click="open_popup(msg)" style="jusify-content:left;">
                    <img v-if="msg.expand.user.avatar"
                        :src="`https://shield.pockethost.io/api/files/users/${msg.expand.user.id+'/'+msg.expand.user.avatar}`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <img v-else src="/icon.png" class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <div class="ml-2">
                        <div class="text-sm">
                            {{ msg.expand.user.username }}
                        </div>
                        <span class="text-md ml-2 break-all">{{ msg.text }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="scroll" class="h-32 md:h-48 w-full md:w-3/5" style="float:right;"></div>
        <div class="w-full p-2 fixed bottom-0 left-0 bg-zinc-700 flex flex-col h-32 md:h-48 z-40">
            <div class="w-full flex justify-center flex-row gap-2 mb-2">
                <div v-for="srvr in servers" @click="change_server(srvr)" :key="srvr.id" :id="srvr.id">
                    <img v-if="srvr.id == server.id"
                        :src="`https://shield.pockethost.io/api/files/servers/${srvr.id}/${srvr.icon}`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-lg" />
                    <img v-else-if="srvr.id == 'servers'" :src="`/plus.png`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <img v-else-if="srvr.id == 'settings'" :src="`/gear.png`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <img v-else :src="`https://shield.pockethost.io/api/files/servers/${srvr.id}/${srvr.icon}`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                </div>
            </div>
            <div class="w-full flex justify-center">
                <input v-model="input_field" class="border-2 border-none rounded text-black w-11/12 p-4" />
                <button class="ml-2 bg-blue-500 rounded pl-2 pr-2 border-none"
                    @click="$event.preventDefault; sendMessage({ text: input_field, user: user?.id, channel: channel.id }); input_field = '';">Send!</button>
            </div>
            <AppModal v-model="show_msg_modal" v-slot="{ close }">
                <div class="flex p-2 transition-all w-full" style="jusify-content:left;">
                    <img v-if="modal_msg.expand.user.avatar"
                        :src="`https://shield.pockethost.io/api/files/users/${modal_msg.expand.user.id+'/'+modal_msg.expand.user.avatar}`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <img v-else src="/icon.png" class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <div class="ml-2">
                        <div class="text-sm">
                            {{ modal_msg.expand.user.username }}
                        </div>
                        <span class="text-md ml-2 break-all">{{ modal_msg.text }}</span>
                    </div>
                </div>
                <div class="mt-2 flex flex-col gap-2 md:w-1/6">
                    <button v-if="user?.is_admin" class="bg-red-500 p-2 rounded">Delete <i class="fa-solid fa-trash"></i></button>
                    <button v-if="user?.id == modal_msg.expand.user.id" class="bg-green-500 p-2 rounded">Edit <i class="fa-solid fa-pen"></i></button>
                    <button class="bg-cyan-500 p-2 rounded">Copy Text <i class="fa-solid fa-copy"></i></button>
                </div>
            </AppModal>
        </div>
    </div>
</template>
<script setup lang="ts">
import { user, getMessages, sendMessage, getServers } from '../../user/services/UserService';
import { useRouter } from "vue-router";
import { onMounted, onDeactivated, ref, computed } from 'vue';
import { useBreakpoint } from '../../browser/ViewportService'
import AppModal from '../../components/AppModal.vue'
import client from '../../api/PocketBaseClient';
const router = useRouter();
const { breakpoint } = useBreakpoint();

const mobile_menu_open = ref(false)
const show_mobile_menu_open = computed(() => {
    return mobile_menu_open.value && breakpoint.value === 'sm'
})

let unsubscribe: () => void;

const messages = ref(<any>[]);
const input_field = ref("");
const server = ref({ id: "", name: "", categories: [], expand: { categories: <any>[] } });
const servers = ref(<any>[]);
const categories = ref(<any>[]);
const channel = ref();
const channels = ref(<any>[]);

const show_msg_modal = ref(false);
const modal_msg = ref({ id: "", expand: { user: { id: "", avatar: "", username: "" } }, text: "" });

onMounted(async () => {
    if (user == null) {
        router.push("/")
    }
    (await getServers()).items.forEach(el => {
        servers.value.push(el);
    });
    if (servers.value[0] != undefined) {
        if(localStorage.getItem("last_server")){
            server.value = servers.value[servers.value.findIndex(function (el:any){
                return el.id === localStorage.getItem("last_server")
            })];
            if(server.value == undefined){
                server.value = servers.value[0];
            }
        }
        else{
            server.value = servers.value[0];
        }
        change_server(server.value);
    }
    servers.value.push({
        id: "servers",
    });
    servers.value.push({
        id: "settings",
    });
    unsubscribe = await client.collection('messages').subscribe("*", async ({ action, record }) => {
        if (action == "create") {
            const msg_user = await client.collection("users").getOne(record.user);
            record.expand = { user: msg_user }
            messages.value = [...messages.value, record];
            if (msg_user.id == user?.id) {
                setTimeout(function () {
                    document.getElementById("scroll")?.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
                }, 500)
            }
        }
        else if (action == "delete") {
            console.log(messages.value.filter((msg: any) => msg.id !== record.id))
            messages.value = messages.value.filter((msg: any) => msg.id !== record.id)
        }
        else if (action == "update") {
            var index = messages.value.findIndex((msg: any) => {
                return msg.id == record.id
            })
            messages.value[index].text = record.text;
        }
    })
})
onDeactivated(async () => {
    unsubscribe();
})

async function change_server(srvr: any) {
    if (srvr.id != "servers" && srvr.id != "settings" && srvr.id != undefined) {
        localStorage.setItem("last_server", srvr.id);
        server.value = srvr;
        categories.value = [];
        channels.value = [];
        server.value.expand.categories.forEach(async (el: any, index: number) => {
            categories.value.push(el);
            server.value.expand.categories[index].expand.channels.forEach((el: any) => {
                channels.value.push(el);
            });
        });
        if(localStorage.getItem(`last_channel_${srvr.id}`) != undefined){ 
            change_channels(channels.value[channels.value.findIndex(function (el:any){
                return el.id === localStorage.getItem(`last_channel_${srvr.id}`)
            })]);
        }
        else{
            change_channels(channels.value[0]);
        }
    }
    else if (srvr.id) {
        router.push(`/${srvr.id}`)
    }
}
async function change_channels(chnl: any) {
    localStorage.setItem(`last_channel_${chnl.server}`, chnl.id);
    messages.value = [];
    channel.value = chnl;
    (await getMessages(1, 20, channel.value.id)).items.forEach(el => {
        messages.value.push(el);
    });
    messages.value.reverse();
    setTimeout(function () {
        document.getElementById("scroll")?.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
    }, 500)
}
function format_text(text: string) {
    if (text.length > 25) {
        return text.slice(0, 22) + "...";
    }
    else {
        return text;
    }
}
function open_popup(msg:any){
    modal_msg.value = msg;
    show_msg_modal.value = true;
}
</script>
<style setup lang="css">
body {
    background-color: rgb(82 82 91);
}

.top-nav-menu-item {
  position: relative;
}

.top-nav-menu-item>ul {
  display: none;
  position: absolute;

}

.top-nav-menu-item:hover>ul {
  display: block;
}

.top-nav-menu__mobile-menu-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 1;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>