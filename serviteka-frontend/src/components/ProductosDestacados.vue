<template>
  <section class="productos">
    <h2>Productos Destacados</h2>

    <div class="grid">
      <div class="card" v-for="producto in productos" :key="producto.id">
        <div class="badge">Oferta</div>
        <h3>{{ producto.nombre }}</h3>
        <p class="precio">${{ producto.precio.toLocaleString() }}</p>
        <button>Ver más</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const productos = [
  { id: 1, nombre: "Batería Automotriz", precio: 250000 },
  { id: 2, nombre: "Cambio de Aceite", precio: 120000 },
  { id: 3, nombre: "Revisión General", precio: 80000 }
]
</script>

<style scoped>
.productos {
  padding: 50px;
  text-align: center;
}

h2 {
  margin-bottom: 30px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  position: relative;
  transition: 0.3s;
}

.card:hover {
  transform: scale(1.05);
}

.badge {
  background: red;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
}

.precio {
  font-weight: bold;
  margin: 10px 0;
}

button {
  background: #f4c400;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
}
</style>