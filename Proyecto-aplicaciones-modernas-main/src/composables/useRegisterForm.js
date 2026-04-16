// ─────────────────────────────────────────────────────────────────────────────
// COMPOSABLE — src/composables/useRegisterForm.js
//
// Centraliza TODA la lógica del formulario de registro:
//   · Estado de los campos (form)
//   · Errores por campo (errors)
//   · Estado de envío (isLoading, successMessage, apiError)
//
// SCRUM-82  Campos requeridos: nombre, correo, contraseña
// SCRUM-83  Validación de campos obligatorios
// SCRUM-84  Validación de formato de correo electrónico
// SCRUM-85  Validación de requisitos mínimos de contraseña
// SCRUM-86  Mensajes de error por campo
// SCRUM-87  Mensaje de confirmación al registrarse exitosamente
// SCRUM-88  Integración con endpoint de registro
// SCRUM-89  Redirección tras registro exitoso
// SCRUM-100 Guardado en base de datos (a través del endpoint)
//
// Para cambiar el endpoint de registro modifica la constante API_URL.
// Para cambiar las reglas de validación edita las funciones validate*().
// ─────────────────────────────────────────────────────────────────────────────

import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// ── Constantes ────────────────────────────────────────────────────────────────
// SCRUM-88: Cambia esta URL por la del endpoint real de tu backend
const API_URL = 'https://api.serviteka.com/auth/register'

// SCRUM-85: Requisitos mínimos de contraseña
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/   // al menos 1 minúscula, 1 mayúscula, 1 número

// SCRUM-84: Regex de correo electrónico
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Composable ────────────────────────────────────────────────────────────────
export function useRegisterForm() {
  const router = useRouter()

  // SCRUM-82: Estado de los campos del formulario
  const form = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // SCRUM-86: Errores por campo
  const errors = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Estado de envío
  const isLoading = ref(false)
  const successMessage = ref('')   // SCRUM-87
  const apiError = ref('')

  // ── Validadores individuales ─────────────────────────────────────────────
  // SCRUM-83: Valida que el nombre no esté vacío
  function validateName() {
    if (!form.name.trim()) {
      errors.name = 'El nombre es obligatorio.'
      return false
    }
    errors.name = ''
    return true
  }

  // SCRUM-83 + SCRUM-84: Valida formato de correo
  function validateEmail() {
    if (!form.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio.'
      return false
    }
    if (!EMAIL_REGEX.test(form.email)) {
      errors.email = 'Ingresa un correo electrónico válido.'
      return false
    }
    errors.email = ''
    return true
  }

  // SCRUM-83 + SCRUM-85: Valida requisitos mínimos de contraseña
  function validatePassword() {
    if (!form.password) {
      errors.password = 'La contraseña es obligatoria.'
      return false
    }
    if (form.password.length < PASSWORD_MIN_LENGTH) {
      errors.password = `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
      return false
    }
    if (!PASSWORD_REGEX.test(form.password)) {
      errors.password = 'Debe contener al menos una mayúscula, una minúscula y un número.'
      return false
    }
    errors.password = ''
    return true
  }

  // SCRUM-83: Valida confirmación de contraseña
  function validateConfirmPassword() {
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña.'
      return false
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.'
      return false
    }
    errors.confirmPassword = ''
    return true
  }

  // ── Validación completa del formulario ───────────────────────────────────
  function validateAll() {
    const results = [
      validateName(),
      validateEmail(),
      validatePassword(),
      validateConfirmPassword()
    ]
    return results.every(Boolean)
  }

  // ── Envío del formulario ─────────────────────────────────────────────────
  // SCRUM-88 + SCRUM-100: Llama al endpoint y guarda la info en BD
  async function submitForm() {
    apiError.value = ''
    successMessage.value = ''

    if (!validateAll()) return

    isLoading.value = true

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        apiError.value = data.message || 'Ocurrió un error al registrarse. Intenta de nuevo.'
        return
      }

      // SCRUM-87: Mensaje de confirmación
      successMessage.value = '¡Registro exitoso! Redirigiendo...'

      // SCRUM-89: Redirige al usuario tras registro exitoso
      // Para cambiar la ruta de redirección modifica el segundo argumento:
      setTimeout(() => router.push({ name: 'Register' }), 1500)

    } catch {
      apiError.value = 'No se pudo conectar con el servidor. Verifica tu conexión.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    form,
    errors,
    isLoading,
    successMessage,
    apiError,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    submitForm
  }
}