<template>
  <div class="home">
    <div class="overlay">
      <h1>Serviteka 🔧</h1>
      <p>Tu taller de confianza para servicios automotrices</p>

      <div class="buttons">
        <button @click="goLogin">Iniciar sesión</button>
        <button class="register" @click="goRegister">Registrarse</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goRegister = () => router.push('/register')
const goLogin = () => alert('Login próximamente 😅')
</script>

<style scoped>
.home {
  height: 100vh;
  background: url('https://images.unsplash.com/photo-1515923162033-4f6f7e56d06f') no-repeat center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  background: rgba(0,0,0,0.7);
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  color: white;
}

h1 {
  font-size: 40px;
}

p {
  margin: 10px 0 20px;
}

.buttons button {
  margin: 5px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.register {
  background: orange;
  color: white;
}
</style>