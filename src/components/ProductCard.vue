<template>
<div class="card">
<img 

:src="producto.imagen || 'https://via.placeholder.com/150'"
:key="producto.id"
>
>
<h3>{{producto.nombre}}</h3>
<p class="desc">{{producto.descripcion}}</p>
<p class="precio">$ {{producto.precio}}</p>

<button class="agregar" @click="$emit('agregar',producto)">
Agregar
</button>

</div>
</template>

<script>
export default{
props:["producto"]
}
</script>