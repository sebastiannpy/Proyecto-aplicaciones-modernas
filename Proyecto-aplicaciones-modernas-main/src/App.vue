<template>

  <div v-if="mostrarMensaje" class="mensaje">
    {{ mensaje }}
  </div>

  <!-- INICIO -->
  <div v-if="vista === 'inicio'" class="inicio">
    <div class="cardInicio">
      <h1>TALLER AL VOLANTE</h1>

      <button class="btn" @click="vista = 'login'">Iniciar sesión</button>
      <button class="btn register" @click="vista = 'registro'">Registrarse</button>
    </div>
  </div>

  <!-- LOGIN -->
  <div v-else-if="vista === 'login'" class="auth">
    <div class="cardAuth">
      <h2>INICIAR SESION</h2>

      <input v-model="correo" placeholder="Correo electrónico">
      <input type="password" v-model="password" placeholder="Contraseña">

      <button @click="login">Entrar</button>

      <p @click="vista = 'registro'" class="link">
        ¿No tienes cuenta? Regístrate
      </p>
    </div>
  </div>

  <!-- REGISTRO -->
  <div v-else-if="vista === 'registro'" class="auth">
    <div class="cardAuth">
      <h2>CREAR CUENTA</h2>

      <input v-model="correo" placeholder="Correo electrónico">
      <input type="password" v-model="password" placeholder="Contraseña">

      <button @click="registro">Registrarse</button>

      <p @click="vista = 'login'" class="link">
        ¿Ya tienes cuenta? Inicia sesión
      </p>
    </div>
  </div>

  <!-- CARRITO -->
  <CarritoView
    v-else-if="vista === 'carrito'"
    :carrito="carrito"
    :total="total"
    @volver="vista = 'app'"
    @incrementar="carrito[$event].cantidad++"
    @decrementar="carrito[$event].cantidad > 1 ? carrito[$event].cantidad-- : carrito.splice($event, 1)"
    @eliminar="carrito.splice($event, 1)"
    @login="vista = 'login'"
    @direccion="vista = 'direccion'"
  />

  <!-- DIRECCIÓN (NUEVO SIN ROMPER ESTILOS) -->
  <div v-else-if="vista === 'direccion'" class="auth">
    <div class="cardAuth">

      <h2>DIRECCIÓN DE ENVÍO</h2>

      <input v-model="direccion.ciudad" placeholder="Ciudad">
      <input v-model="direccion.direccion" placeholder="Dirección">
      <input v-model="direccion.referencia" placeholder="Referencia">

      <button @click="validarDireccion">
        Validar dirección
      </button>

      <button 
        @click="confirmarCompra"
        :disabled="!direccionValida"
        :class="{ disabled: !direccionValida }"
      >
        Confirmar compra
      </button>

      <p v-if="errorDireccion" class="link" style="color:red;">
        {{ errorDireccion }}
      </p>

    </div>
  </div>

  <!-- APP PRINCIPAL -->
  <div v-else>

    <header class="header">
      <h1 class="titulo">Taller El Volante</h1>

      <div class="acciones">

        <button class="btnGrande" @click="menuUser = !menuUser">
          Usuario
        </button>

        <div v-if="menuUser" class="menuUser">
          <button class="btnGrande opcion" @click="logout">
            Cerrar sesión
          </button>
        </div>

        <button class="btnGrande">Filtro</button>

        <button class="btnGrande" @click="vista = 'carrito'">
          Carrito ({{ totalItems }})
        </button>

        <button class="btnGrande" @click="showM = !showM">
          Menu
        </button>

      </div>
    </header>

    <section class="buscador">
      <input v-model="buscar" placeholder="Buscar..." />
    </section>

    <div class="layout">

      <aside class="menu" v-if="showM">
        <h3>Categorías</h3>

        <button
          class="categoria"
          v-for="c in cats"
          :key="c"
          @click="cat = c"
        >
          {{ c || 'Todos' }}
        </button>
      </aside>

      <main class="contenido">

        <section class="destacado">
          <button class="flecha"
            @click="i = (i - 1 + productos.length) % productos.length">
            ◀
          </button>

          <div class="cardGrande">
            <img :src="productos[i].imagen">

            <h2>{{ productos[i].nombre }}</h2>
            <p class="desc">{{ productos[i].descripcion }}</p>
            <p class="precio">$ {{ productos[i].precio }}</p>

            <button class="agregar" @click="add(productos[i])">
              Agregar al carrito
            </button>
          </div>

          <button class="flecha"
            @click="i = (i + 1) % productos.length">
            ▶
          </button>
        </section>

        <section class="productos">
          <div class="card" v-for="p in filtrados" :key="p.id" @click="detalle = p">

            <div v-if="p.etiqueta" class="etiqueta">{{ p.etiqueta }}</div>

            <img :src="p.imagen">
            <h3>{{ p.nombre }}</h3>
            <p class="desc">{{ p.descripcion }}</p>
            <p class="precio">$ {{ p.precio }}</p>

            <button class="agregar" @click.stop="add(p)">
              Agregar
            </button>

          </div>
        </section>

      </main>
    </div>

    <!-- MODAL -->
    <div v-if="detalle" class="modal">
      <div class="modalContenido">

        <img :src="detalle.imagen">
        <h2>{{ detalle.nombre }}</h2>
        <p>{{ detalle.descripcion }}</p>
        <p class="precio">$ {{ detalle.precio }}</p>

        <button class="agregarCarro" @click="add(detalle)">
          Agregar al carrito
        </button>

        <button class="cerrar" @click="detalle = null">
          Cerrar
        </button>

      </div>
    </div>

  </div>

</template>



  <style scoped>

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .mensaje {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: red;
    color: white;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 18px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  /* auth */
  .inicio {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: gray;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  }

  .cardInicio {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    background: white;
    padding: 50px;
    width: 30%;
    border-radius: 12px;
    text-align: center;
  }

  .btn,
  .register,
  .ghost {
    border: 0.5px solid black;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 20px;
    background-color: gray;
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 10px;
    animation: all 0.3s ease;
  }

  .btn:hover,
  .register:hover,
  .ghost:hover {
    transform: scale(1.1);
    color: black;
    background-color: white;
  }

  .register {
    background: orange;
  }


  /* auth */
  .auth {

    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: gray;
  }

  .cardAuth {
    display: flex;
    border: 1px solid black;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 300px;
  }

  .cardAuth h2 {
    font-size: 30px;
    margin-bottom: 20px;
  }

  .cardAuth button {
    background: gray;
    border-radius: 5px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    width: 100%;
    padding: 10px;
    animation: all 0.3s ease;
  }

  .cardAuth button:hover {
    transform: scale(1.05);
    background: white;
    color: black;

  }
  input {
    width: 100%;
    padding: 15px;
    font-size: 15px;
    border: 0.5px solid black;
    border-radius: 5px;
  }

  .link {
    color: blue;
    cursor: pointer;
    margin-top: 10px;
  }

  .flecha {
    background: transparent;
    border: none;
    font-size: 30px;
    cursor: pointer;
  }

  .cardGrande {
    width: 420px;     
    height: 450px;   
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }

  .cardGrande img {
    width: 90%;
    height: 250px;
    object-fit: contain;

  }

  .modalcontenido {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 1000;
  }

  .productos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
  }

  .productos .card {
    border: 0.5px solid black;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    position: relative;
  }

  .productos .card img {
    width: 100%;
    height: 150px;
    object-fit: contain;
  }

  .productos .card .etiqueta {
    position: absolute;
    top: 10px;
    left: 10px;
    background: red;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .productos .card .precio {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
  }


  .modalContenido{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    max-width: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .modalContenido img {
    width: 100%;
    height: 300px;
    object-fit: contain; 
  }


  .agregarCarro, .cerrar {
    background: red;
    padding: 10px;
    font-size: 18px;
    color: white;
    border: none;
    border-radius: 5px;
    margin-top: 20px;
    margin-right: 15px;
    cursor: pointer;
  }
  .cerrar {
    background: gray;
  }
  </style>

<script>
import DireccionView from '@/components/DireccionView.vue'
import { productos } from '@/data/productos'
import CarritoView from '@/components/CarritoView.vue'
import { supabase } from '@/supabase'

export default {
  components: { CarritoView, DireccionView },

  data() {
    return {
      vista: 'inicio',

      correo: "",
      password: "",

      mensaje: "",
      mostrarMensaje: false,

      productos,
      carrito: [],
      buscar: "",
      i: 0,
      showM: true,
      cat: "",
      detalle: null,
      menuUser: false,

      cats: ["", "Frenos", "Motor", "Suspensión", "Electricidad", "Llantas"],

      direccion: {
        ciudad: "",
        direccion: "",
        referencia: ""
      },

      direccionValida: false,
      errorDireccion: ""
    }
  },

  computed: {
    filtrados() {
      return this.productos.filter(p =>
        p.nombre.toLowerCase().includes(this.buscar.toLowerCase()) &&
        (!this.cat || p.categoria === this.cat)
      )
    },

    totalItems() {
      return this.carrito.reduce((t, p) => t + p.cantidad, 0)
    },

    total() {
      return this.carrito.reduce((t, p) => t + (p.precio * p.cantidad), 0)
    }
  },

  methods: {

    traducirError(error) {
      if (error.includes("Password should be at least"))
        return "La contraseña debe tener mínimo 6 caracteres"

      if (error.includes("User already registered"))
        return "Este correo ya está registrado"

      if (error.includes("Invalid login credentials"))
        return "Correo o contraseña incorrectos"

      return error
    },

    add(p) {
      const e = this.carrito.find(c => c.id === p.id)

      if (e) {
        e.cantidad++
      } else {
        this.carrito.push({ ...p, cantidad: 1 })
      }

      this.mensaje = `${p.nombre} agregado al carrito`
      this.mostrarMensaje = true

      setTimeout(() => {
        this.mostrarMensaje = false
      }, 2000)
    },

    // VALIDAR DIRECCIÓN
    validarDireccion() {
      if (!this.direccion.ciudad || !this.direccion.direccion) {
        this.mensaje = "Completa ciudad y dirección"
        this.mostrarMensaje = true

        setTimeout(() => {
          this.mostrarMensaje = false
        }, 2000)

        this.direccionValida = false
        return
      }

      this.direccionValida = true

      this.mensaje = "Dirección validada correctamente. Puedes confirmar tu compra"
      this.mostrarMensaje = true

      setTimeout(() => {
        this.mostrarMensaje = false
      }, 2500)
    },

    // CONFIRMAR COMPRA
    confirmarCompra() {
      if (!this.direccionValida) {
        this.mensaje = "Debes validar la dirección primero"
        this.mostrarMensaje = true

        setTimeout(() => {
          this.mostrarMensaje = false
        }, 2000)

        return
      }

      this.carrito = []
      this.direccionValida = false

      this.mensaje = "Compra realizada con éxito"
      this.mostrarMensaje = true

      setTimeout(() => {
        this.mostrarMensaje = false
        this.vista = 'app'
      }, 2000)
    },

    // LOGIN
    async login() {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: this.correo,
          password: this.password
        })

        if (error) throw error

        this.mensaje = "Inicio de sesión exitoso"
        this.mostrarMensaje = true

        setTimeout(() => {
          this.mostrarMensaje = false
          this.vista = 'app'
        }, 2000)

      } catch (err) {
        this.mensaje = this.traducirError(err.message)
        this.mostrarMensaje = true
      }
    },

    // REGISTRO
    async registro() {
      try {
        const { error } = await supabase.auth.signUp({
          email: this.correo,
          password: this.password
        })

        if (error) throw error

        const { error: insertError } = await supabase
          .from('usuarios')
          .insert([
            {
              name: this.correo.split('@')[0],
              email: this.correo
            }
          ])

        if (insertError) throw insertError

        this.mensaje = "Usuario creado correctamente"
        this.mostrarMensaje = true

        setTimeout(() => {
          this.mostrarMensaje = false
          this.vista = 'login'
        }, 2000)

      } catch (err) {
        this.mensaje = this.traducirError(err.message)
        this.mostrarMensaje = true
      }
    },

    // LOGOUT
    async logout() {
      await supabase.auth.signOut()

      this.vista = 'inicio'

      this.mensaje = "Sesión cerrada"
      this.mostrarMensaje = true

      setTimeout(() => {
        this.mostrarMensaje = false
      }, 2000)
    }
  },

  async mounted() {
    const { data } = await supabase.auth.getSession()

    if (data.session) {
      this.vista = 'app'
    }
  }
}
</script>