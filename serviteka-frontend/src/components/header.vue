<template>
  <div class="container-title">
    <h1>Titulo de la aplicacion</h1>

    <div class="buttons">
      <button></button>
      <button></button>
      <button></button>
    </div>
  </div>

  <div class="container-descuentos">
    
    <div class="descuentos"></div>

    <div class="productos-container">
      <div v-for="n in 6" :key="n" class="productos"></div>
    </div>

  </div>
</template>

<style scoped>

/* Fondo gris para el header, con un contenedor para el título y los botones */
.container-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 15px;
  background-color: gray;
  color: white;
}

/* Diseño del título de la aplicación */
.container-title h1 {
  margin: 0;
  font-size: 3rem;
}

/* Organización de los botones en el header con espacio entre ellos */
.buttons {
  display: flex;
  gap: 25px;
}

/* Estilo de los tres botones superiores */
button {
  width: 100px;
  cursor: pointer;
  border-radius: 5px;
  height: 35px;
  font-size: 1rem;
  border: 1px solid #333;
}

/* esto es para el contenedor de los descuentos y productos, con un diseño en columna y centrado, con espacio entre los elementos  */
.container-descuentos {
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding: 40px;
  gap: 4rem;        
}

/* Estilo de los descuentos (cuadro grande central) */
.descuentos {
  background-color: gray;
  width: 40rem;
  height: 200px;
  border-radius: 5px;
  flex-shrink: 0; /* Evita que el cuadro se deforme al hacer scroll */
}

/* Organización de los productos en 3 columnas */
.productos-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 50rem; 
}

/* Estilo de los productos */
.productos {
  background-color: gray;
  height: 140px;
  border-radius: 4px; 
}

</style>