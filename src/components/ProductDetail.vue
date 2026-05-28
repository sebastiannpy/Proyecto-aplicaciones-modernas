<template>

<div class="modal">

<div class="modalContent">

<button class="close" @click="$emit('cerrar')">X</button>

<img :src="producto.imagen">

<h2>{{producto.nombre}}</h2>

<p>Precio: ${{producto.precio}}</p>

<p>Repuesto de alta calidad para tu vehículo.</p>

<button @click="$emit('agregar',producto)">
Agregar al carrito
</button>

</div>

</div>

</template>

<script>

export default{
props:["producto"]
}

</script>

<style>

.modal{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.5);
display:flex;
justify-content:center;
align-items:center;
}

.modalContent{
background:white;
padding:30px;
width:300px;
text-align:center;
}

.close{
float:right;
cursor:pointer;
}

.modalContent img{
width:200px;
}

</style>