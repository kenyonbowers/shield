import client from "../../api/PocketBaseClient";

export const user = client.authStore.model;

client.authStore.onChange((auth) => {
    user?.set(client.authStore.model);
})

export async function login(email:string, password:string){
    if(email.includes("@")){
        await client.collection('users').authWithPassword(email, password);
    }
}
export async function signup(username:string, password:string, confirm_password:string, email:string){
    try{
        var regex = /\d/g;
        if(!username.includes("@") && username.length >= 5 && username.length <= 15 && !regex.test(username) && password.length >= 8 && password == confirm_password){
            const signup_data = {
                email,
                username,
                password,
                passwordConfirm: confirm_password,
            }
            await client.collection('users').create(signup_data);
            await login(email, password);
        }
    }
    catch(err){
        console.log(err);
    }
}
export async function logout(){
    client.authStore.clear();
}

export async function getUserBadges() {
    var return_badges = <any>[];
    console.log(user?.badges)
    await user?.badges.forEach(async(badge:any, index:number) => {
        console.log(badge)
        var badge_data = await client.collection('badges').getOne(badge);
        console.log(badge_data)
        return_badges.push(badge_data);
        if(index == user?.badges.length-1){
            console.log(return_badges)
            return return_badges;
        }
    });
}

export async function getMessages(page:number, per_page:number, channel_id:string){
    var messages = await client.collection("messages").getList(page, per_page, { sort: "-created", expand: "user", filter: `channel.id="${channel_id}"` });
    return messages;
}
export async function sendMessage(message:any) {
    if(message.text.trim() != ""){
        message.text = message.text.trim();
        await client.collection("messages").create(message)
    }
    else{
        console.log("Failed to send message.")
    }
}

export async function getServers(){
    var servers = await client.collection("servers").getList(1, 20, { sort: "-created", expand: "channels", filter: `members~"${user?.id}"` });
    return servers;
}
export async function getServer(server_id:any){
    var server = await client.collection("servers").getOne(server_id);
    return server;
}
export async function getAllServers(){
    var servers = await client.collection("servers").getFullList(200, { sort: "-created" });
    return servers;
}
export async function joinServer(server_id:any){
    try{
        var server = await getServer(server_id);
        var members = server.members;
        if(!members.includes(user?.id)){
            members.push(user?.id);
            await client.collection("servers").update(server_id, {
                name: server.name,
                icon: server.icon,
                members: members
            });
        }
        return true;
    }
    catch(err){
        return false;
    }
}