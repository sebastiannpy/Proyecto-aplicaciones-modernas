<template>
  <!-- importamos el componente del header para mostrarlo en app.vue -->
  <Header />
</template>

<!-- esta etiqueta ayuda a que no existan espacios estre elementos (quita la margen que por defecto tiene el body) y asi el header se vea pegado a la parte superior de la pagina   -->
<style>
body {
  margin: 0;
}
</style>

<script setup>
//  Importamos el componente del header para mostrarlo en app.vue
import Header from './components/Header.vue'
</script>
