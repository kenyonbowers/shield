<template>
    <!-- PC & Tablet -->
    <div class="font-title text-white w-full h-screen" v-if="server && servers && breakpoint != 'sm'">
        <div v-if="server && channel" class="w-3/4 md:w-5/8 bg-zinc-700 h-16 pt-5"
            style="float:right; text-align:center;">
            {{ server.name }} - {{ channel.name }}
        </div>
        <div class="flex flex-row w-full">
            <div class="bg-zinc-500 fixed top-0 left-0 h-full w-3/8 px-4 pt-2 break-all">
                <div v-for="ctgry in categories" class="mb-2">
                    <span class="font-bold">{{ format_text(ctgry.name) }}</span>
                    <div v-for="chnl in ctgry.expand.channels">
                        <button @click="changeChannels(chnl)"><i class="fa-solid fa-bars"></i> {{ format_text(chnl.name)
                        }}</button>
                    </div>
                </div>
            </div>
            <div class="bg-zinc-500 h-full w-3/8 pl-4 pt-2">
            </div>
            <div id="msg_viewer">
                <div v-for="msg in messages" :key="msg.id" :id="msg.id" class="flex p-2" style="jusify-content:left;">
                    <img v-if="msg.expand.user.avatar"
                        :src="`https://shield.pockethost.io/api/files/users/${msg.expand.user.id + '/' + msg.expand.user.avatar}`"
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
        <div id="scroll" class="h-32 md:h-48 w-3/5" style="float:right;"></div>
        <div class="w-full p-2 fixed bottom-0 left-0 bg-zinc-700 flex flex-col h-32 md:h-48">
            <div class="w-full flex justify-center flex-row gap-2 mb-2">
                <div v-for="srvr in servers" @click="changeServer(srvr)" :key="srvr.id" :id="srvr.id">
                    <img v-if="srvr.id == server.id"
                        :src="`https://shield.pockethost.io/api/files/servers/${srvr.id}/${srvr.icon}`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded" />
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
                    @click="$event.preventDefault; sendMessage({ text: input_field, user: user?.id, channel: channel.id })">Send!</button>
            </div>
        </div>
    </div>
    <!-- Mobile -->
    <div class="font-title text-white w-full h-screen" v-else-if="server && servers">
        <div v-if="server && channel" class="bg-zinc-700 h-16 pt-5" style="text-align:center;">
            <button @click="mobileMenuOpen = true" class="fixed left-6"><i class="fa-solid fa-bars w-5"></i></button>
            <Transition>
                <div class="top-nav-menu__mobile-menu-panel transition-all bg-zinc-500 z-50 text-white px-4 py-2"
                    v-if="showMobileMenuOpen">
                    <button @click="mobileMenuOpen = false" class="fixed top-5 left-6"><i class="fa-solid fa-close w-5"></i></button>
                    <div class="bg-zinc-500 h-full w-full px-4 pt-10 break-all" style="text-align:start;">
                        <div v-for="ctgry in categories" class="mb-2">
                            <span class="font-bold">{{ ctgry.name }}</span>
                            <div v-for="chnl in ctgry.expand.channels">
                                <button @click="changeChannels(chnl); mobileMenuOpen = false;"><i class="fa-solid fa-bars"></i> {{ chnl.name }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
            {{ server.name }} - {{ channel.name }}
        </div>
        <div class="flex flex-row w-full">
            <div id="msg_viewer">
                <div v-for="msg in messages" :key="msg.id" :id="msg.id" class="flex p-2" style="jusify-content:left;">
                    <img v-if="msg.expand.user.avatar"
                        :src="`https://shield.pockethost.io/api/files/users/${msg.expand.user.id + '/' + msg.expand.user.avatar}`"
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
        <div id="scroll" class="h-32 md:h-48 w-3/5" style="float:right;"></div>
        <div class="w-full p-2 fixed bottom-0 left-0 bg-zinc-700 flex flex-col h-32 md:h-48">
            <div class="w-full flex justify-center flex-row gap-2 mb-2">
                <div v-for="srvr in servers" @click="changeServer(srvr)" :key="srvr.id" :id="srvr.id">
                    <img v-if="srvr.id == server.id"
                        :src="`https://shield.pockethost.io/api/files/servers/${srvr.id}/${srvr.icon}`"
                        class="min-w-12 min-h-12 max-w-12 max-h-12 rounded" />
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
                    @click="$event.preventDefault; sendMessage({ text: input_field, user: user?.id, channel: channel.id })">Send!</button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { user, getMessages, sendMessage, getServers } from '../../user/services/UserService';
import { useRouter } from "vue-router";
import { onMounted, onDeactivated, ref, computed } from 'vue';
import { useBreakpoint } from '../../browser/ViewportService'
import client from '../../api/PocketBaseClient';
const router = useRouter();
const { breakpoint } = useBreakpoint();

const mobileMenuOpen = ref(false)
const showMobileMenuOpen = computed(() => {
    return mobileMenuOpen.value && breakpoint.value === 'sm'
})

let unsubscribe: () => void;

const messages = ref(<any>[]);
const input_field = ref();
const server = ref({ id: "", name: "", categories: [], expand: { categories: <any>[] } });
const servers = ref(<any>[]);
const category = ref();
const categories = ref(<any>[]);
const channel = ref();
const channels = ref(<any>[]);

onMounted(async () => {
    if (user == null) {
        router.push("/")
    }
    (await getServers()).items.forEach(el => {
        servers.value.push(el);
    });
    if (servers.value[0] != undefined) {
        server.value = servers.value[0];
        changeServer(server.value);
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

async function changeServer(srvr: any) {
    if (srvr.id != "servers" && srvr.id != "settings" && srvr.id != undefined) {
        server.value = srvr;
        categories.value = [];
        channels.value = [];
        server.value.expand.categories.forEach(async (el: any, index: number) => {
            categories.value.push(el);
            server.value.expand.categories[index].expand.channels.forEach((el: any) => {
                channels.value.push(el);
            });
        });
        changeChannels(channels.value[0]);
    }
    else if (srvr.id) {
        router.push(`/${srvr.id}`)
    }
}
async function changeChannels(chnl: any) {
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
    if (text.length > 15) {
        return text.slice(0, 12) + "...";
    }
    else {
        return text;
    }
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