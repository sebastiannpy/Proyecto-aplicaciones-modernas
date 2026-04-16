<template>

<Header
:cantidad="carrito.length"
@carrito="mostrarCarrito=!mostrarCarrito"
@menu="mostrarMenu=!mostrarMenu"
/>

<Cart v-if="mostrarCarrito" :productos="carrito"/>

<section class="buscador">
<input v-model="buscar" placeholder="Buscar..." />
<button class="btnBuscar">Buscar</button>
</section>

<div class="layout">

<Categories v-if="mostrarMenu" @filtrar="categoriaSeleccionada=$event"/>

<main class="contenido">
<Destacados
v-if="productoActual"
:producto="productoActual"
@agregar="agregarCarrito"
@siguiente="siguiente"
@anterior="anterior"
/>

<div class="productos">

<ProductCard
v-for="p in productosFiltrados"
:key="p.id"
:producto="p"
@agregar="agregarCarrito"
@click="detalleProducto=p"
/>

</div>

</main>

</div>

<ProductDetail
v-if="detalleProducto"
:producto="detalleProducto"
@cerrar="detalleProducto=null"
@agregar="agregarCarrito"
/>

</template>

<script>
import Header from '../components/Header.vue'
import Cart from '../components/Cart.vue'
import Categories from '../components/Categories.vue'
import Destacados from '../components/Destacados.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductDetail from '../components/ProductDetail.vue'

export default {
components:{
Header,Cart,Categories,Destacados,ProductCard,ProductDetail
},

data(){
return{
buscar:"",
carrito:[],
mostrarCarrito:false,
mostrarMenu:true,
categoriaSeleccionada:"",
detalleProducto:null,
indice:0,

productos:[
{
id:1,
nombre:"Pastillas de freno",
precio:120000,
categoria:"Frenos",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774496131/pastillas_br4ude.jpg"
},
{
id:2,
nombre:"Bujía",
precio:50000,
categoria:"Motor",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774496115/bujia_vphaxm.jpg"
},
{
id:3,
nombre:"Amortiguador",
precio:250000,
categoria:"Suspensión",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774496100/amortiguador_egqox4.jpg"
},
{
id:4,
nombre:"Filtro de aire",
precio:40000,
categoria:"Motor",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774496069/filtro_gezkpd.jpg"
},
{
id:5,
nombre:"Aceite",
precio:80000,
categoria:"Motor",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774496056/aceite_kpo22t.jpg"
},
{
id:6,
nombre:"Llanta",
precio:400000,
categoria:"Llantas",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774496042/llanta_jhrwxh.jpg"
},
{
id:7,
nombre:"Batería",
precio:180000,
categoria:"Electricidad",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774496027/bateria_f009t4.jpg"
},
{
id:8,
nombre:"Suspensión completa",
precio:600000,
categoria:"Suspensión",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774496007/2-11403-11404-001_Unity_Fully_Loaded_Strut_Set_Of_2_For_Chevy_Left_Right_Pair_qeku8i.jpg"
},
{
id:9,
nombre:"Llanta deportiva",
precio:450000,
categoria:"Llantas",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774495989/llanta2_wa551a.jpg"
},
{
id:10,
nombre:"Radiador",
precio:300000,
categoria:"Motor",
imagen:"https://res.cloudinary.com/db69rnqvy/image/upload/v1774495865/radiador_njswnj.jpg"
}
]
}
},

computed:{
productosFiltrados(){
return this.productos.filter(p =>
p.nombre.toLowerCase().includes(this.buscar.toLowerCase()) &&
(this.categoriaSeleccionada=="" || p.categoria==this.categoriaSeleccionada)
)
}
},

methods:{
agregarCarrito(p){
this.carrito.push(p)
},
siguiente(){
this.indice=(this.indice+1)%this.productos.length
},
anterior(){
this.indice=(this.indice-1+this.productos.length)%this.productos.length
}
}
}
</script>