<template>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/signup">Sign Up</RouterLink>
</template>
<script setup lang="ts">
import { user } from '../../user/services/UserService';
import { useRouter } from "vue-router"
const router = useRouter();
if(user != null){
    router.replace("/me")
}
</script>