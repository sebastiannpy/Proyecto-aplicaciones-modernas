<template>

<div class="sidebar">

<button @click="$emit('filtrar','')">Todos</button>
<button @click="$emit('filtrar','Frenos')">Frenos</button>
<button @click="$emit('filtrar','Motor')">Motor</button>
<button @click="$emit('filtrar','Suspensión')">Suspensión</button>

</div>

</template>

<style>

.sidebar{
position:absolute;
left:20px;
top:250px;

display:flex;
flex-direction:column;
gap:15px;
}

.sidebar button{

background:red;
color:white;

border:none;

padding:14px;

font-size:16px;

cursor:pointer;

width:160px;

border-radius:6px;

transition:.3s;
}

.sidebar button:hover{

background:black;
}

</style>
