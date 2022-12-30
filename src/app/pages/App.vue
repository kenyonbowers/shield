<template>
    <div class="font-title text-white w-full h-screen" v-if="server && servers">
        <div v-if="server && channel" class="w-full md:w-3/4 md:w-5/8 bg-zinc-700 fixed top-0 right-0 h-16 pt-5 z-30"
            style="float:right; text-align:center;">
            <button v-if="breakpoint == 'sm'" @click="mobile_menu_open = true" class="fixed left-6"><i
                    class="fa-solid fa-bars fa-xl"></i></button>
            <Transition v-if="breakpoint == 'sm'">
                <div class="top-nav-menu__mobile-menu-panel transition-all bg-zinc-500 text-white px-4 py-2"
                    v-if="show_mobile_menu_open && breakpoint == 'sm'">
                    <button @click="mobile_menu_open = false" class="fixed top-4 left-6"><i
                            class="fa-solid fa-close fa-2xl"></i></button>
                    <div class="bg-zinc-500 h-full w-full px-2 pt-12 break-all" style="text-align:start;">
                        <div v-for="ctgry in categories" class="mb-2">
                            <span class="font-bold">{{ ctgry.name }}</span>
                            <div v-for="chnl in ctgry.expand.channels">
                                <button @click="change_channels(chnl); mobile_menu_open = false;"><i
                                        class="fa-solid fa-bars"></i> {{ chnl.name }}</button>
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
            <div v-if="breakpoint != 'sm'"
                class="bg-zinc-500 fixed top-0 left-0 h-full w-1/4 md:w-3/8 px-4 pt-2 break-all">
                <div v-for="ctgry in categories" class="mb-2">
                    <span class="font-bold">{{ format_text(ctgry.name) }}</span>
                    <div v-for="chnl in ctgry.expand.channels">
                        <button @click="change_channels(chnl)"><i class="fa-solid fa-bars"></i> {{
        format_text(chnl.name)
}}</button>
                    </div>
                </div>
            </div>
            <div v-if="breakpoint != 'sm'" class="bg-zinc-500 h-full w-1/4 md:w-3/8 pl-4 pt-2">
            </div>
            <div id="msg_viewer" class="w-full md:w-3/4 md:w-5/8">
                <div v-for="msg in messages" :key="msg.id" :id="msg.id"
                    class="flex p-2 hover:bg-zinc-500 transition-all w-full" @click="open_popup(msg)"
                    style="jusify-content:left;">
                    <img v-if="msg.expand.user.avatar"
                        :src="`https://shield.pockethost.io/api/files/users/${msg.expand.user.id + '/' + msg.expand.user.avatar}`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <img v-else src="/icon.png" class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                    <div class="ml-2">
                        <div class="text-sm">
                            {{ msg.expand.user.username }}
                            <span v-if="msg.edited">(Edited)</span>
                        </div>
                        <span class="text-md ml-2 break-all">{{ msg.text }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="scroll" class="h-36 md:h-52 w-full md:w-3/5" style="float:right;"></div>
        <div class="w-full p-2 fixed bottom-0 left-0 bg-zinc-700 flex flex-col">
            <div v-if="editing_msg || replying" class="border-b-2 border-zinc-500 px-2 mb-2 flex flex-row" style="z-index:10;">
                <div class="w-1/2">
                    <span v-if="editing_msg">Editing Message</span>
                    <span v-else-if="replying">Replying to Message</span>
                </div>
                <div class="w-1/2 flex flex-row-reverse">
                    <button @click="close_indication()"><i
                            class="fa-solid fa-close fa-xl"></i></button>
                </div>
            </div>
            <div class="h-32 md:h-48">
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
                        @click="$event.preventDefault; send_button({ text: input_field, user: user?.id, channel: channel.id, edited: editing_msg, replying: replying_msg_id }); input_field = '';">Send!</button>
                </div>
            </div>
        </div>
        <Transition>
            <div v-if="show_msg_modal" class="z-50 fixed top-0 left-0 w-full h-full">
                <div class="flex items-center h-full">
                    <div class="w-full flex justify-center z-50">
                        <div class="bg-zinc-600 p-2 w-11/12 md:w-1/3 rounded-lg">
                            <div class="flex p-2 transition-all w-full" style="jusify-content:left;">
                                <img v-if="modal_msg.expand.user.avatar"
                                    :src="`https://shield.pockethost.io/api/files/users/${modal_msg.expand.user.id + '/' + modal_msg.expand.user.avatar}`"
                                    class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                                <img v-else src="/icon.png" class="min-w-12 min-h-12 max-w-12 max-h-12 rounded-full" />
                                <div class="ml-2">
                                    <div class="text-sm">
                                        {{ modal_msg.expand.user.username }}
                                        <span v-if="modal_msg.edited">(Edited)</span>
                                    </div>
                                    <span class="text-md ml-2 break-all">{{ modal_msg.text }}</span>
                                </div>
                            </div>
                            <div class="mt-2 flex flex-col gap-2 md:w-1/6 justify-center">
                                <button v-if="user?.is_admin"
                                    class="bg-red-500 hover:bg-red-400 active:bg-red-600 transition-all p-2 rounded md:w-32"
                                    @click="deleteMessage(modal_msg); close_popup()">Delete <i
                                        class="fa-solid fa-trash ml-1"></i></button>
                                <button v-if="user?.id == modal_msg.expand.user.id"
                                    class="bg-green-500 hover:bg-green-400 active:bg-green-600 transition-all p-2 rounded md:w-32"
                                    @click="edit_message(modal_msg)">Edit <i class="fa-solid fa-pen ml-1"></i></button>
                                <button
                                    class="bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 transition-all p-2 rounded md:w-32"
                                    @click="copy_string(modal_msg.text)">Copy Text <i
                                        class="fa-solid fa-copy ml-1"></i></button>
                                <!--<button
                                    class="bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 transition-all p-2 rounded md:w-32"
                                    @click="reply(modal_msg.id)">Reply <i
                                        class="fa-solid fa-reply ml-1"></i></button>-->
                            </div>
                        </div>
                    </div>
                    <div @click="close_popup()"
                        class="fixed top-0 left-0 z-40 w-full h-full bg-black opacity-40"></div>
                </div>
            </div>
        </Transition>
    </div>
</template>
<script setup lang="ts">
import { user, getMessages, sendMessage, deleteMessage, editMessage, getServers } from '../../user/services/UserService';
import { useRouter } from "vue-router";
import { onMounted, onDeactivated, ref, computed } from 'vue';
import { useBreakpoint } from '../../browser/ViewportService'
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
const modal_msg = ref({ id: "", edited: false, replying: [], expand: { user: { id: "", avatar: "", username: "" } }, text: "" });
const editing_msg = ref(false);
const editing_msg_id = ref("");
const replying = ref(false);
const replying_msg_id = ref();

const loading_new_msg = ref(false);
const at_end = ref(false);
const next_page = ref(1);
const is_mounted = ref(false);

onMounted(async () => {
    if (user == null) {
        router.push("/")
    }
    (await getServers()).items.forEach(el => {
        servers.value.push(el);
    });
    if (servers.value[0] != undefined) {
        if (localStorage.getItem("last_server")) {
            server.value = servers.value[servers.value.findIndex(function (el: any) {
                return el.id === localStorage.getItem("last_server")
            })];
            if (server.value == undefined) {
                server.value = servers.value[0];
            }
        }
        else {
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
                return msg.id == record.id;
            })
            messages.value[index].text = record.text;
            messages.value[index].edited = true;
        }
    })
    setTimeout(function () {
        is_mounted.value = true;
    }, 1000)
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
        if (localStorage.getItem(`last_channel_${srvr.id}`) != undefined) {
            change_channels(channels.value[channels.value.findIndex(function (el: any) {
                return el.id === localStorage.getItem(`last_channel_${srvr.id}`)
            })]);
        }
        else {
            change_channels(channels.value[0]);
        }
    }
    else if (srvr.id) {
        router.push(`/${srvr.id}`)
    }
}
async function change_channels(chnl: any) {
    next_page.value = 1;
    localStorage.setItem(`last_channel_${chnl.server}`, chnl.id);
    messages.value = [];
    channel.value = chnl;
    (await getMessages(next_page.value, 20, channel.value.id)).items.forEach(el => {
        messages.value.push(el);
    });
    next_page.value++;
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
function open_popup(msg: any) {
    //@ts-expect-error
    document.querySelector("body").style.overflow = 'hidden';
    modal_msg.value = msg;
    show_msg_modal.value = true;
}
function close_popup(){
    //@ts-expect-error
    document.querySelector("body").style.overflow = '';
    show_msg_modal.value = false
}
function close_indication(){
    if(editing_msg.value){
        editing_msg.value = false;
        input_field.value = '';
    }
    else if(replying.value){
        replying.value = false;
        replying_msg_id.value = null;
    }
}
function scroll_to_msg(msg_id:string){
    document.getElementById(msg_id)?.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
}
function edit_message(msg: any) {
    close_popup();
    replying.value = false;
    replying_msg_id.value = null;
    show_msg_modal.value = false;
    input_field.value = msg.text;
    editing_msg_id.value = msg.id;
    editing_msg.value = true;
}
function send_button(msg_data: any) {
    if (editing_msg.value){
        editMessage(editing_msg_id.value, msg_data);
        editing_msg.value = false;
    }
    else{
        sendMessage(msg_data);
    }
    replying_msg_id.value = null;
    replying.value = false;
}
function reply(msg_id:string){
    close_popup();
    editing_msg.value = false;
    replying_msg_id.value = msg_id;
    replying.value = true;
}
window.onscroll = async function () {
    if (document.body.scrollTop === 0 && !loading_new_msg.value && is_mounted.value && !at_end.value){
        loading_new_msg.value = true;
        await getMessages(next_page.value, 20, channel.value.id).then((data)=>{
            var is_already = false;
            data.items.forEach((el:any) => {
                messages.value.forEach((element:any)=>{
                    if(element.id == el.id){
                        is_already = true;
                    }
                })
            });
            if(is_already){
                at_end.value = true;
            }
            else{
                next_page.value += 1;
                messages.value = [...data.items.reverse(), ...messages.value];
                loading_new_msg.value = false;
            }
        });
    }
}
function copy_string(str: string) {
    var el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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