<template>
  <div class="itemCarrito">
    {{ item.nombre }} - ${{ item.precio }}
    <button @click="$emit('eliminar', item.id)">X</button>
  </div>
</template>

<script>
export default {
  props: ['item']
}
</script>