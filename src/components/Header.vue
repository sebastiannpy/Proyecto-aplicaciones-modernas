<template>
<header class="header">

<h1 class="titulo">Taller de Repuestos El Volante</h1>

<div class="acciones">
<button class="btnGrande">Filtro</button>

<button class="btnGrande" @click="$emit('carrito')">
Carrito ({{cantidad}})
</button>

<button class="btnGrande" @click="$emit('menu')">
Menu
</button>
</div>

</header>
</template>

<script>
export default{
props:["cantidad"]
}
</script>