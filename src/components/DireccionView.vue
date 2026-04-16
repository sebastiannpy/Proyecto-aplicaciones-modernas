<template>
  <div class="direccionContainer">

    <div class="direccionCard">

      <h2>Dirección de envío</h2>

      <input v-model="direccion.ciudad" placeholder="Ciudad" />
      <input v-model="direccion.direccion" placeholder="Dirección" />
      <input v-model="direccion.referencia" placeholder="Referencia (opcional)" />

      <button class="btn" @click="validar">
        Validar dirección
      </button>

      <p v-if="error" style="color:red">
        {{ error }}
      </p>

      <button
        v-if="valida"
        class="btnComprar"
        @click="$emit('confirmar', direccion)"
      >
        Confirmar compra
      </button>

      <button class="btnCancelar" @click="$emit('volver')">
        Volver
      </button>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      direccion: {
        ciudad: "",
        direccion: "",
        referencia: ""
      },
      valida: false,
      error: ""
    };
  },

  methods: {
    validar() {
      if (!this.direccion.ciudad || !this.direccion.direccion) {
        this.error = "Completa ciudad y dirección";
        this.valida = false;
        return;
      }

      this.error = "";
      this.valida = true;
    }
  }
};
</script>