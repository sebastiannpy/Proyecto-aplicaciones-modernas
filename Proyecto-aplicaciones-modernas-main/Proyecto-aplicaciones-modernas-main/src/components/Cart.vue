<template>
<div class="panelCarrito">

<h3>Productos en carrito</h3>

<div v-if="productos.length==0">
Carrito vacío
</div>

<div v-for="p in productos" :key="p.id" class="itemCarrito">
<strong>{{p.nombre}}</strong>
<p>$ {{p.precio}}</p>
</div>

</div>
</template>

<script>
export default{props:["productos"]}
</script>