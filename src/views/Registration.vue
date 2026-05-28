<template>
  <div class="container">
    <div class="card">
      <h2>Crear cuenta</h2>

      <form @submit.prevent="submitForm">
        
        <input v-model="form.name" placeholder="Nombre completo" />
        <span class="error">{{ errors.name }}</span>

        <input v-model="form.email" placeholder="Correo electrónico" />
        <span class="error">{{ errors.email }}</span>

        <input type="password" v-model="form.password" placeholder="Contraseña" />
        <span class="error">{{ errors.password }}</span>

        <input type="password" v-model="form.confirmPassword" placeholder="Confirmar contraseña" />
        <span class="error">{{ errors.confirmPassword }}</span>

        <p class="error">{{ apiError }}</p>
        <p class="success">{{ successMessage }}</p>

        <button :disabled="isLoading">
          {{ isLoading ? 'Registrando...' : 'Registrarse' }}
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { useRegisterForm } from '@/composables/useRegisterForm'

const {
  form,
  errors,
  isLoading,
  successMessage,
  apiError,
  submitForm
} = useRegisterForm()
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #1e1e1e, #2c3e50);
}

.card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 350px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
}

button {
  width: 100%;
  padding: 10px;
  background: #ff6600;
  color: white;
  border: none;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 12px;
}

.success {
  color: green;
}
</style>