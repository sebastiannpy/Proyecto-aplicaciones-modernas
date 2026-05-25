<template>
<div class="carritoContainer">

  <div class="carritoHeader">
    <button class="cerrarCarrito" @click="$emit('volver')">✕</button>
    <h2>Tu Carrito</h2>
  </div>

  <div class="carritoLayout">

    <!-- 🛒 PRODUCTOS -->
    <div class="carritoProductos">

      <div v-if="!carrito.length" class="carritoVacio">
        <p>Tu carrito está vacío</p>
        <small>Agrega productos para continuar con tu compra.</small>
      </div>

      <div v-for="(p, idx) in carrito" :key="idx" class="itemCarrito">

        <img :src="p.imagen" class="itemImg">

        <div class="itemInfo">
          <h4>{{ p.nombre }}</h4>
          <p v-if="p.noDisponible" class="itemWarning">
            Producto no disponible actualmente.
          </p>

          <p class="precioItem">
            ${{ (p.precio * p.cantidad).toLocaleString() }}
          </p>

          <div class="controles">
            <button class="btnCantidad" :disabled="p.noDisponible" @click="$emit('decrementar', idx)">−</button>
            <span class="cantidad">{{ p.cantidad }}</span>
            <button class="btnCantidad" :disabled="p.noDisponible" @click="$emit('incrementar', idx)">+</button>
          </div>
        </div>

        <button class="btnEliminar" @click="$emit('eliminar', idx)">X</button>
      </div>

    </div>

    <!--  RESUMEN -->
    <div class="carritoResumen">

      <h3>Resumen de compra</h3>

      <div class="resumenLinea">
        <span>Productos ({{ carrito.length }})</span>
        <span>${{ total.toLocaleString() }}</span>
      </div>

      <div class="resumenLinea">
        <span>Envío</span>
        <span>Gratis</span>
      </div>

      <div class="totalFinal">
        <strong>Total</strong>
        <strong>${{ total.toLocaleString() }}</strong>
      </div>

      <p v-if="bloquearContinuar" class="resumenWarning">
        Debes eliminar los productos no disponibles para continuar.
      </p>
      <p v-else-if="!carrito.length" class="resumenWarning">
        Debes agregar al menos un producto para continuar.
      </p>

      <!--  PASO A DIRECCIÓN  -->
      <button class="btnComprar" :disabled="bloquearContinuar || !carrito.length" @click="continuarDireccion">
        Continuar
      </button>

    </div>

  </div>
</div>
</template>

<script>
export default {
  props: {
    carrito: Array,
    total: Number,
    bloquearContinuar: Boolean
  },
  methods: {
    continuarDireccion() {
      if (!this.carrito?.length || this.bloquearContinuar) return
      this.$emit('direccion')
    }
  }
}
</script>
