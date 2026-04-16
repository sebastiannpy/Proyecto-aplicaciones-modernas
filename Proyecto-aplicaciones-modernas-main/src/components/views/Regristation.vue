<template>
  <div class="register-container">
    <h2>Registro</h2>

    <form @submit.prevent="submitForm">
      
      <!-- Nombre -->
      <div>
        <input v-model="form.name" placeholder="Nombre" />
        <span class="error">{{ errors.name }}</span>
      </div>

      <!-- Email -->
      <div>
        <input v-model="form.email" placeholder="Correo" />
        <span class="error">{{ errors.email }}</span>
      </div>

      <!-- Password -->
      <div>
        <input type="password" v-model="form.password" placeholder="Contraseña" />
        <span class="error">{{ errors.password }}</span>
      </div>

      <!-- Confirm Password -->
      <div>
        <input type="password" v-model="form.confirmPassword" placeholder="Confirmar contraseña" />
        <span class="error">{{ errors.confirmPassword }}</span>
      </div>

      <!-- Error API -->
      <p class="error">{{ apiError }}</p>

      <!-- Success -->
      <p class="success">{{ successMessage }}</p>

      <!-- Botón -->
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Registrarse' }}
      </button>

    </form>
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
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
}

.error {
  color: red;
  font-size: 12px;
}

.success {
  color: green;
}
</style>