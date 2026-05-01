<template>
<section class="destacado">

<button class="flecha" @click="$emit('anterior')">◀</button>

<div class="cardGrande">
<img 
:src="producto?.imagen || 'https://via.placeholder.com/300'"
:key="producto?.id"
>

<h2>{{producto.nombre}}</h2>
<p class="desc">{{producto.descripcion}}</p>
<p class="precio">$ {{producto.precio}}</p>

<button class="agregar" @click="$emit('agregar',producto)">
Agregar
</button>

</div>

<button class="flecha" @click="$emit('siguiente')">▶</button>

</section>
</template>

<script>
export default{
props:["producto"]
}
</script>