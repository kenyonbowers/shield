<template>
    <vue-final-modal v-slot="{ params, close }" v-bind="$attrs" classes="modal-container" content-class="modal-content">
      <slot v-bind="params" :close="close"></slot>
  
      <button class="absolute top-2 right-2" @click="close">
        
      </button>
    </vue-final-modal>
</template>
  
<script setup lang="ts">

  
</script>
  
  
<style scoped>
:deep(.modal-container) {
    display: flex;
    justify-content: center;
    align-items: center;
}
  
:deep(.modal-content) {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid rgb(113 113 122);
    border-radius: 0.25rem;
    background: rgb(82 82 91);
    position: relative;
    width: 100%;
    max-width: 768px;
}
</style>