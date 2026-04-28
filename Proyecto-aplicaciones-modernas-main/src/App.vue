<template>

  <div v-if="mostrarMensaje" class="mensaje" :style="{ background: mensajeColor }">
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
    :bloquear-continuar="hasProductosNoDisponibles"
    @volver="vista = 'app'"
   @incrementar="incrementarItem($event)"
@decrementar="decrementarItem($event)"
@eliminar="eliminarItemCarrito($event)"
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
        class="btnSecundario"
        @click="calcularTiempoEntrega(true)"
        :disabled="!direccion.ciudad || !direccion.direccion || calculandoEntrega"
      >
        {{ calculandoEntrega ? 'Calculando...' : 'Actualizar tiempo de entrega' }}
      </button>

      <div class="bloqueEntrega" v-if="tiempoEntregaTexto || errorEntrega">
        <p v-if="tiempoEntregaTexto" class="textoEntrega">{{ tiempoEntregaTexto }}</p>
        <p v-if="entregaActualizadaEn" class="textoEntregaMeta">Actualizado: {{ entregaActualizadaEn }}</p>
        <p v-if="errorEntrega" class="textoEntregaError">{{ errorEntrega }}</p>
      </div>

      <button 
        @click="irAPago"
        :disabled="!direccionValida"
        :class="{ disabled: !direccionValida }"
      >
        Continuar a pago
      </button>

      <p v-if="errorDireccion" class="link" style="color:red;">
        {{ errorDireccion }}
      </p>

    </div>
  </div>

  <!-- PAGO -->
  <div v-else-if="vista === 'pago'" class="auth">
    <div class="cardAuth pagoCard">
      <h2>MÉTODO DE PAGO</h2>

      <div class="metodosPago">
        <label
          v-for="metodo in metodosPago"
          :key="metodo.id"
          class="metodoPago"
          :class="{ metodoPagoActivo: metodoPagoSeleccionado === metodo.id }"
        >
          <input
            type="radio"
            :value="metodo.id"
            v-model="metodoPagoSeleccionado"
            @change="errorPago = ''"
          >
          <img class="metodoPagoIcono" :src="iconoMetodoPago(metodo.id)" :alt="metodo.name">
          <span class="metodoPagoInfo">
            <strong>{{ metodo.name }}</strong>
            <small>{{ metodo.description }}</small>
          </span>
          <span class="badgeSeguro">Seguro</span>
        </label>
      </div>

      <template v-if="metodoPagoSeleccionado === 'card'">
        <div class="logosTarjeta">
          <img src="https://img.icons8.com/color/96/visa.png" alt="Visa">
          <img src="https://img.icons8.com/color/96/mastercard-logo.png" alt="Mastercard">
          <img src="https://img.icons8.com/color/96/amex.png" alt="American Express">
        </div>
        <input v-model="pago.cardNumber" placeholder="Número de tarjeta">
        <input v-model="pago.holder" placeholder="Nombre del titular">
        <input v-model="pago.expiry" placeholder="MM/AA">
        <input v-model="pago.cvv" placeholder="CVV">
      </template>

      <template v-else-if="metodoPagoSeleccionado === 'pse'">
        <div class="bancosPse">
          <label
            v-for="banco in bancosPse"
            :key="banco.name"
            class="chipBanco"
            :class="{ chipBancoActivo: pago.bank === banco.name }"
          >
            <input
              type="radio"
              name="bancoPse"
              :value="banco.name"
              v-model="pago.bank"
              @change="errorPago = ''"
            >
            <img :src="banco.logo" :alt="banco.name">
            <span>{{ banco.name }}</span>
          </label>
        </div>
        <input v-model="pago.bank" placeholder="Banco seleccionado">
        <input v-model="pago.document" placeholder="Documento">
      </template>

      <template v-else-if="metodoPagoSeleccionado === 'cash_on_delivery'">
        <p class="ayudaPago">
          Pagarás en efectivo al momento de recibir tu pedido.
        </p>
      </template>

      <button class="btnSecundario" @click="vista = 'direccion'">
        Cambiar dirección
      </button>
      <button
        @click="confirmarCompraConPago"
        :disabled="procesandoPago"
      >
        {{ procesandoPago ? 'Procesando pago...' : 'Pagar y confirmar compra' }}
      </button>

      <p v-if="errorPago" class="link" style="color:red;">
        {{ errorPago }}
      </p>
    </div>
  </div>

  <!-- PEDIDOS -->
  <div v-else-if="vista === 'pedidos'" class="auth">
    <div class="cardAuth pedidosCard">
      <h2>ESTADO DE MIS PEDIDOS</h2>

      <button class="btnSecundario" @click="vista = 'app'">
        Volver
      </button>

      <button class="btnSecundario" @click="cargarPedidos">
        Actualizar pedidos
      </button>

      <p v-if="cargandoPedidos">Cargando pedidos...</p>
      <p v-else-if="!pedidos.length">
        No tienes pedidos registrados.
      </p>

      <div v-else class="listaPedidos">
        <div v-for="pedido in pedidos" :key="pedido.id" class="itemPedido">
          <div class="encabezadoPedido">
            <strong>#{{ pedido.order_number }}</strong>
            <span class="estadoPedido">{{ pedido.status }}</span>
          </div>
          <p>Fecha: {{ formatFecha(pedido.created_at) }}</p>
          <p>Total: ${{ Number(pedido.total_amount || 0).toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ADMIN PRODUCTOS -->
  <div v-else-if="vista === 'adminProductos'" class="auth">
    <div class="cardAuth adminCard">
      <h2>PANEL ADMIN - PRODUCTOS</h2>

      <button class="btnSecundario" @click="vista = 'app'">
        Volver
      </button>
      <button
        class="btnSecundario"
        :disabled="ejecutandoBootstrapProductos"
        @click="ejecutarBootstrapProductos"
      >
        {{ ejecutandoBootstrapProductos ? 'Cargando catálogo...' : 'Cargar catálogo base' }}
      </button>

      <div class="adminForm">
        <input v-model="adminProducto.name" placeholder="Nombre del producto">

        <div class="adminGrid">
          <input v-model.number="adminProducto.price" type="number" min="1" placeholder="Precio">
          <input v-model.number="adminProducto.stock" type="number" min="0" placeholder="Stock">
        </div>

        <div class="adminGrid">
          <select v-model="adminProducto.category">
            <option disabled value="">Selecciona categoría</option>
            <option v-for="c in categoriasDisponibles.filter(Boolean)" :key="c" :value="c">{{ c }}</option>
          </select>
          <input v-model="adminProducto.brand" placeholder="Marca">
        </div>

        <input v-model="adminProducto.image_url" placeholder="URL de imagen (puedes pegarla de Google Imágenes)">
        <div class="previewImagenAdmin">
          <img
            v-if="adminProducto.image_url"
            :src="adminProducto.image_url"
            alt="Preview imagen producto"
            @error="onPreviewImageError"
          >
          <span v-else>Vista previa de la imagen</span>
        </div>
        <textarea v-model="adminProducto.description" rows="3" placeholder="Descripción del producto"></textarea>

        <button :disabled="guardandoAdminProducto" @click="guardarProductoDesdePanel">
          {{ guardandoAdminProducto ? 'Guardando...' : (editandoProductoId ? 'Actualizar producto' : 'Guardar producto') }}
        </button>
        <button
          v-if="editandoProductoId"
          class="btnSecundario"
          :disabled="guardandoAdminProducto"
          @click="cancelarEdicionProducto"
        >
          Cancelar edición
        </button>
      </div>

      <div class="adminLista">
        <h3>Productos existentes</h3>
        <div v-if="!productos.length" class="adminVacio">No hay productos disponibles.</div>
        <div v-else class="tablaAdminWrap">
          <table class="tablaAdmin">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in productos" :key="p.id">
                <td>{{ p.nombre }}</td>
                <td>{{ p.categoria }}</td>
                <td>${{ Number(p.precio || 0).toLocaleString() }}</td>
                <td>{{ p.stock }}</td>
                <td class="accionesAdmin">
                  <button class="btnEditarAdmin" @click="editarProductoDesdeLista(p)">Editar</button>
                  <button class="btnEliminarAdmin" @click="eliminarProductoDesdeLista(p)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- APP PRINCIPAL -->
  <div v-else>

    <header class="header">
      <h1 class="titulo">Taller El Volante</h1>

      <div class="acciones">

        <button class="btnGrande btnHeader btnUsuario" @click="menuUser = !menuUser">
          <span>Mi cuenta</span>
        </button>

        <div v-if="menuUser" class="menuUser">
          <button
            v-if="isAdmin"
            class="btnGrande opcion opcionPerfil"
            @click="abrirPanelAdmin"
          >
            <span>Panel admin</span>
          </button>
          <button class="btnGrande opcion opcionPerfil" @click="abrirPedidosDesdePerfil">
            <span>Mis pedidos</span>
          </button>
          <button class="btnGrande opcion opcionLogout" @click="logout" title="Cerrar sesión">
            <span class="iconoPower">⏻</span>
            <span>Cerrar sesión</span>
          </button>
        </div>

        <button class="btnGrande btnHeader btnSecundarioHeader">Filtrar</button>

        <button class="btnGrande btnHeader btnNoti" @click="toggleNotificaciones">
          Notificaciones
          <span v-if="noLeidasCount" class="badgeNoti">{{ noLeidasCount }}</span>
        </button>

        <button class="btnGrande btnHeader btnCarritoHeader" @click="vista = 'carrito'">
          Carrito ({{ totalItems }})
        </button>

        <button class="btnGrande btnHeader btnSecundarioHeader" @click="showM = !showM">
          Categorías
        </button>

      </div>
    </header>

    <section v-if="mostrarNotificaciones" class="panelNotificaciones">
      <h3>Bandeja de notificaciones</h3>

      <div v-if="cargandoNotificaciones">Cargando notificaciones...</div>
      <div v-else-if="!notificaciones.length">No tienes notificaciones</div>

      <button
        v-for="noti in notificacionesOrdenadas"
        :key="noti.id"
        class="itemNotificacion"
        :class="{ leida: noti.is_read }"
        @click="abrirNotificacion(noti)"
      >
        <div class="mensajeNoti">
          <strong>{{ labelTipoNotificacion(noti.type) }}</strong>
          <p>{{ noti.message }}</p>
          <small>{{ formatFecha(noti.created_at) }}</small>
        </div>
        <span class="estadoNoti">
          {{ noti.is_read ? 'Leída' : 'No leída' }}
        </span>
      </button>
    </section>

    <section class="buscador">
      <input v-model="buscar" placeholder="Buscar..." />
    </section>

    <div class="layout">

      <aside class="menu" v-if="showM">
        <h3>Categorías</h3>

        <button
          class="categoria"
          v-for="c in categoriasDisponibles"
          :key="c"
          @click="cat = c"
        >
          {{ c || 'Todos' }}
        </button>
      </aside>

      <main class="contenido">

        <section v-if="productoActual" class="destacado">
          <button class="flecha"
            @click="irAnteriorDestacado">
            ◀
          </button>

          <div class="cardGrande">
            <img :src="productoActual.imagen">

            <h2>{{ productoActual.nombre }}</h2>
            <p class="desc">{{ productoActual.descripcion }}</p>
            <p class="precio">$ {{ productoActual.precio }}</p>

            <button class="agregar" @click="add(productoActual)">
              Agregar al carrito
            </button>
          </div>

          <button class="flecha"
            @click="irSiguienteDestacado">
            ▶
          </button>
        </section>
        <section v-else class="destacado">
          <p>No hay productos disponibles en este momento.</p>
        </section>

        <section class="productos">
          <div class="card" v-for="p in filtrados" :key="p.id" @click="abrirDetalleProducto(p)">

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

        <div class="bloqueResenas">
          <h3>Calificaciones y reseñas</h3>
          <p v-if="resumenResenas.count">
            Calificación promedio:
            <span class="stars">{{ renderStars(Math.round(resumenResenas.average)) }}</span>
            {{ resumenResenas.average }}/5 ({{ resumenResenas.count }} reseñas)
          </p>
          <p v-else>Aún no hay reseñas para este producto.</p>

          <div v-if="cargandoResenas">Cargando reseñas...</div>
          <div v-else class="listaResenas">
            <div v-for="resena in resenasProducto" :key="resena.id" class="itemResena">
              <strong>
                {{ resena.reviewer_name }} -
                <span class="stars">{{ renderStars(resena.rating) }}</span>
                {{ resena.rating }}/5
              </strong>
              <p>{{ resena.comment }}</p>
              <small>{{ formatFecha(resena.created_at) }}</small>
            </div>
          </div>

          <div class="formResena">
            <h4>Tu reseña</h4>
            <p v-if="!puedeResenar">Solo puedes reseñar productos que ya compraste.</p>
            <template v-else>
              <select v-model="miResena.rating">
                <option disabled value="">Selecciona calificación</option>
                <option v-for="n in 5" :key="n" :value="n">{{ n }} estrella(s)</option>
              </select>
              <textarea v-model="miResena.comment" rows="3" placeholder="Comparte tu experiencia"></textarea>
              <button :disabled="guardandoResena" @click="enviarResena">
                {{ guardandoResena ? 'Guardando...' : 'Guardar reseña' }}
              </button>
              <p v-if="errorResena" style="color:#b00020;">{{ errorResena }}</p>
            </template>
          </div>
        </div>

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
    min-height: 100vh;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: gray;
    overflow-y: auto;
    padding: 24px 12px;
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
    margin: 0 auto;
  }
  .pagoCard {
    width: 540px;
    max-width: 92vw;
  }
  .pedidosCard {
    width: 560px;
    max-width: 92vw;
    align-items: stretch;
  }
  .adminCard {
    width: 700px;
    max-width: 94vw;
    align-items: stretch;
  }
  .adminForm {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .adminGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .adminForm textarea,
  .adminForm select {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    border: 1px solid #c7c7c7;
    border-radius: 6px;
  }
  .previewImagenAdmin {
    width: 100%;
    height: 120px;
    border: 1px dashed #c7c7c7;
    border-radius: 8px;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .previewImagenAdmin img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #fff;
  }
  .previewImagenAdmin span {
    font-size: 13px;
    color: #64748b;
  }
  .adminLista {
    width: 100%;
    margin-top: 6px;
  }
  .adminLista h3 {
    margin: 8px 0 10px;
  }
  .adminVacio {
    border: 1px dashed #b6b6b6;
    border-radius: 8px;
    padding: 12px;
    background: #fafafa;
    color: #444;
  }
  .tablaAdminWrap {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
  }
  .tablaAdmin {
    width: 100%;
    border-collapse: collapse;
    min-width: 560px;
  }
  .tablaAdmin th,
  .tablaAdmin td {
    padding: 10px;
    border-bottom: 1px solid #eee;
    text-align: left;
    font-size: 14px;
  }
  .tablaAdmin th {
    background: #f8fafc;
    color: #374151;
  }
  .btnEditarAdmin {
    border: 1px solid #cbd5e1;
    background: #fff;
    color: #0f172a;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    font-weight: 600;
  }
  .btnEditarAdmin:hover {
    background: #f1f5f9;
  }
  .accionesAdmin {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    white-space: nowrap;
  }
  .btnEliminarAdmin {
    min-width: 88px;
    border: 1px solid #fecaca;
    background: #fff5f5;
    color: #991b1b;
    border-radius: 8px;
    padding: 7px 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  .btnEliminarAdmin:hover {
    background: #fee2e2;
  }
  .listaPedidos {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .itemPedido {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background: #fff;
  }
  .encabezadoPedido {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .estadoPedido {
    text-transform: capitalize;
    font-weight: 700;
    color: #333;
  }
  .metodosPago {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .metodoPago {
    width: 100%;
    border: 1px solid #d7deea;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
    transition: all 0.2s ease;
  }
  .metodoPago:hover {
    border-color: #b8c5db;
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
  }
  .metodoPagoActivo {
    border-color: #0f172a;
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.16);
    background: #f8fafc;
  }
  .metodoPagoInfo {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
    flex: 1;
  }
  .metodoPagoIcono {
    width: 36px;
    height: 36px;
    object-fit: contain;
    border-radius: 8px;
  }
  .metodoPago small {
    color: #4b5563;
  }
  .badgeSeguro {
    font-size: 11px;
    font-weight: 700;
    color: #0f5132;
    background: #d1fae5;
    border: 1px solid #a7f3d0;
    border-radius: 999px;
    padding: 4px 8px;
  }
  .logosTarjeta {
    width: 100%;
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    align-items: center;
  }
  .logosTarjeta img {
    width: 44px;
    height: 28px;
    object-fit: contain;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 2px 6px;
  }
  .bancosPse {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .chipBanco {
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: #fff;
    transition: all 0.2s ease;
  }
  .chipBanco input {
    display: none;
  }
  .chipBanco:hover {
    border-color: #94a3b8;
    box-shadow: 0 6px 12px rgba(15, 23, 42, 0.1);
  }
  .chipBancoActivo {
    border-color: #0f172a;
    background: #f8fafc;
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.14);
  }
  .chipBanco img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
  }
  .chipBanco span {
    font-size: 13px;
    font-weight: 600;
  }
  .ayudaPago {
    font-size: 14px;
    text-align: center;
    margin: 0;
  }
  .btnSecundario {
    background: #555 !important;
  }
  .bloqueEntrega {
    width: 100%;
    border: 1px dashed #999;
    border-radius: 8px;
    padding: 10px;
    background: #f8f8f8;
  }
  .textoEntrega {
    margin: 0;
    font-weight: 600;
  }
  .textoEntregaMeta {
    margin: 6px 0 0;
    font-size: 12px;
    color: #555;
  }
  .textoEntregaError {
    margin: 6px 0 0;
    color: #b00020;
    font-size: 14px;
  }
  .btnNoti {
    position: relative;
  }
  .header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }
  .titulo {
    margin: 0;
    font-size: 24px;
    letter-spacing: 0.2px;
    color: #111827;
  }
  .acciones {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    position: relative;
  }
  .btnGrande {
    height: 42px;
    padding: 0 14px;
    border-radius: 10px;
    border: 1px solid transparent;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .btnHeader {
    border: 1px solid #d1d5db !important;
    background: #ffffff !important;
    color: #111827 !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
  }
  .btnHeader:hover {
    border-color: #9ca3af !important;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
    transform: translateY(-1px);
  }
  .btnCarritoHeader {
    background: #0f172a !important;
    color: #fff !important;
    border-color: #0f172a !important;
  }
  .btnCarritoHeader:hover {
    background: #111827 !important;
    border-color: #111827 !important;
    color: #fff !important;
  }
  .btnUsuario {
    background: #f8fafc !important;
    border-color: #cbd5e1 !important;
  }
  .btnSecundarioHeader {
    background: #f8fafc !important;
    border-color: #d1d5db !important;
  }
  .menuUser {
    position: absolute;
    top: 52px;
    right: 0;
    z-index: 30;
    min-width: 220px;
    padding: 10px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
    background: #fff;
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.18);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .opcionPerfil {
    justify-content: flex-start;
    background: #f8fafc !important;
    color: #0f172a !important;
    border-color: #d1d5db !important;
  }
  .opcionLogout {
    justify-content: flex-start;
    background: #fff5f5 !important;
    color: #991b1b !important;
    border-color: #fecaca !important;
  }
  .iconoPower {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #ff6b6b;
    color: #b00020;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    background: #fff;
  }
  .badgeNoti {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: #d50000;
    color: white;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  @media (max-width: 900px) {
    .header {
      align-items: flex-start;
      flex-direction: column;
    }
    .acciones {
      width: 100%;
    }
    .btnGrande {
      flex: 1 1 160px;
    }
    .menuUser {
      right: auto;
      left: 0;
    }
    .bancosPse {
      grid-template-columns: 1fr;
    }
    .adminGrid {
      grid-template-columns: 1fr;
    }
  }
  .panelNotificaciones {
    margin: 10px 20px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .itemNotificacion {
    border: 1px solid #ddd;
    border-left: 5px solid #d50000;
    border-radius: 8px;
    padding: 10px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    text-align: left;
  }
  .itemNotificacion.leida {
    border-left-color: #999;
    opacity: 0.8;
  }
  .mensajeNoti p {
    margin: 4px 0;
  }
  .estadoNoti {
    font-size: 12px;
    color: #333;
    white-space: nowrap;
    margin-left: 10px;
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
  input[type="radio"] {
    width: auto;
    padding: 0;
    border: 0;
    accent-color: #0f172a;
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


  .modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    overflow-y: auto;
  }

  .modalContenido{
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 560px;
    max-width: 92vw;
    max-height: 92vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .modalContenido img {
    width: 100%;
    max-width: 460px;
    height: auto;
    max-height: 42vh;
    object-fit: contain;
    border-radius: 8px;
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
  .bloqueResenas {
    width: 100%;
    margin-top: 16px;
    text-align: left;
    border-top: 1px solid #ddd;
    padding-top: 12px;
  }
  .listaResenas {
    max-height: 220px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .itemResena {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    background: #fafafa;
  }
  .itemResena p {
    margin: 6px 0;
  }
  .formResena {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .formResena textarea, .formResena select {
    width: 100%;
    border: 1px solid #bbb;
    border-radius: 6px;
    padding: 8px;
  }
  .stars {
    color: #f5a623;
    letter-spacing: 1px;
  }
  </style>

<script>
import DireccionView from '@/components/DireccionView.vue'
import CarritoView from '@/components/CarritoView.vue'
import { supabase } from '@/supabase'
import { actualizarProductoAdmin, bootstrapProductosAdmin, crearProductoAdmin, eliminarProductoAdmin, obtenerProductos } from '@/services/productosService'
import { agregarItem, actualizarItem, eliminarItem, vaciarCarrito, obtenerCarrito } from '@/services/carritoService'
import { obtenerMetodosPago, procesarPago } from '@/services/pagosService'
import { obtenerNotificaciones, marcarNotificacionLeida } from '@/services/notificacionesService'
import { estimarEntrega } from '@/services/entregaService'
import { obtenerPedidos } from '@/services/pedidosService'
import { obtenerResenasProducto, obtenerEstadoMiResena, guardarResena } from '@/services/resenasService'

export default {
  components: { CarritoView, DireccionView },

  data() {
    return {
      vista: 'inicio',
      correo: '',
      password: '',
      mensaje: '',
      mensajeColor: 'red',
      mostrarMensaje: false,
      productos: [],          // ← ya no hardcodeado
      cargando: false,
      errorCarga: null,
      carrito: [],
      carritoCacheUserId: '',
      buscar: '',
      i: 0,
      showM: true,
      cat: '',
      detalle: null,
      menuUser: false,
      isAdmin: false,
      direccion: { ciudad: '', direccion: '', referencia: '' },
      direccionValida: false,
      errorDireccion: '',
      estimacionEntrega: null,
      errorEntrega: '',
      calculandoEntrega: false,
      metodosPago: [],
      metodoPagoSeleccionado: '',
      pago: {
        cardNumber: '',
        holder: '',
        expiry: '',
        cvv: '',
        bank: '',
        document: ''
      },
      bancosPse: [
        { name: 'Bancolombia', logo: 'https://logo.clearbit.com/bancolombia.com' },
        { name: 'Davivienda', logo: 'https://logo.clearbit.com/davivienda.com' },
        { name: 'Banco de Bogotá', logo: 'https://logo.clearbit.com/bancodebogota.com' },
        { name: 'BBVA', logo: 'https://logo.clearbit.com/bbva.com' },
        { name: 'Nequi', logo: 'https://logo.clearbit.com/nequi.com.co' },
      ],
      errorPago: '',
      procesandoPago: false,
      notificaciones: [],
      noLeidasCount: 0,
      mostrarNotificaciones: false,
      cargandoNotificaciones: false,
      pollingNotificaciones: null,
      cargandoCarrito: false,
      unavailableCount: 0,
      pedidos: [],
      cargandoPedidos: false,
      resenasProducto: [],
      resumenResenas: { count: 0, average: 0 },
      cargandoResenas: false,
      puedeResenar: false,
      miResena: { rating: '', comment: '' },
      guardandoResena: false,
      errorResena: '',
      guardandoAdminProducto: false,
      ejecutandoBootstrapProductos: false,
      editandoProductoId: null,
      adminProducto: {
        name: '',
        price: null,
        category: '',
        brand: '',
        stock: null,
        image_url: '',
        description: '',
      },
    }
  },

  async mounted() {
    await this.cargarProductos()
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      this.definirRolDesdeSesion(data.session)
      this.carritoCacheUserId = data.session.user.id
      this.cargarCarritoLocal()
      this.vista = 'app'
      await this.cargarCarritoBackend()
      await this.cargarMetodosPago()
      await this.cargarNotificaciones()
      await this.cargarPedidos()
      this.iniciarPollingNotificaciones()
    }
  },

  beforeUnmount() {
    this.detenerPollingNotificaciones()
  },

  computed: {
    filtrados() {
      return this.productos.filter(p =>
        p.nombre.toLowerCase().includes(this.buscar.toLowerCase()) &&
        (!this.cat || p.categoria === this.cat)
      )
    },
    categoriasDisponibles() {
      const unicas = Array.from(
        new Set(this.productos.map((p) => p.categoria).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b, 'es'))
      return ['', ...unicas]
    },
    productoActual() {
      if (!this.productos.length) return null
      const idx = ((this.i % this.productos.length) + this.productos.length) % this.productos.length
      return this.productos[idx]
    },
    totalItems() {
      return this.carrito.reduce((t, p) => t + p.cantidad, 0)
    },
    total() {
      return this.carrito.reduce((t, p) => t + (p.precio * p.cantidad), 0)
    },
    hasProductosNoDisponibles() {
      return this.carrito.some((item) => item.noDisponible)
    },
    tiempoEntregaTexto() {
      if (!this.estimacionEntrega?.calculable) return ''
      const hours = this.estimacionEntrega.estimatedHours
      const fecha = this.estimacionEntrega.estimatedDate
      const fechaTexto = fecha ? new Date(fecha).toLocaleString('es-CO') : ''
      return `Entrega estimada: ${hours} horas (${fechaTexto})`
    },
    entregaActualizadaEn() {
      if (!this.estimacionEntrega?.updatedAt) return ''
      return new Date(this.estimacionEntrega.updatedAt).toLocaleString('es-CO')
    },
    notificacionesOrdenadas() {
      return [...this.notificaciones].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
  },

  methods: {
    iconoMetodoPago(id) {
      if (id === 'card') return 'https://img.icons8.com/color/96/bank-card-back-side.png'
      if (id === 'pse') return 'https://img.icons8.com/color/96/bank-building.png'
      return 'https://img.icons8.com/color/96/cash-in-hand.png'
    },
    definirRolDesdeSesion(session) {
      const role =
        session?.user?.app_metadata?.role ||
        session?.user?.user_metadata?.role ||
        ''
      this.isAdmin = role === 'admin'
    },
    abrirPanelAdmin() {
      this.menuUser = false
      this.vista = 'adminProductos'
    },
    limpiarFormAdminProducto() {
      this.editandoProductoId = null
      this.adminProducto = {
        name: '',
        price: null,
        category: '',
        brand: '',
        stock: null,
        image_url: '',
        description: '',
      }
    },
    editarProductoDesdeLista(producto) {
      this.editandoProductoId = producto.id
      this.adminProducto = {
        name: producto.nombre || '',
        price: Number(producto.precio || 0),
        category: producto.categoria || '',
        brand: producto.marca || '',
        stock: Number(producto.stock || 0),
        image_url: producto.imagenOriginal || '',
        description: producto.descripcion || '',
      }
    },
    async eliminarProductoDesdeLista(producto) {
      if (!this.isAdmin) return
      const ok = window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)
      if (!ok) return
      try {
        await eliminarProductoAdmin(producto.id)
        await this.cargarProductos()
        if (this.editandoProductoId === producto.id) {
          this.limpiarFormAdminProducto()
        }
        this.mostrar('Producto eliminado correctamente', 'green')
      } catch (err) {
        this.mostrar(err.message || 'No se pudo eliminar el producto', 'red')
      }
    },
    async ejecutarBootstrapProductos() {
      if (!this.isAdmin) return
      this.ejecutandoBootstrapProductos = true
      try {
        const result = await bootstrapProductosAdmin()
        await this.cargarProductos()
        this.mostrar(
          `Bootstrap listo: +${result.inserted || 0} nuevos, ${result.updatedImages || 0} imágenes actualizadas`,
          'green',
        )
      } catch (err) {
        this.mostrar(err.message || 'No se pudo cargar el catálogo base', 'red')
      } finally {
        this.ejecutandoBootstrapProductos = false
      }
    },
    cancelarEdicionProducto() {
      this.limpiarFormAdminProducto()
    },
    async guardarProductoDesdePanel() {
      if (!this.isAdmin) {
        this.mostrar('Solo administradores pueden crear productos', 'red')
        return
      }
      if (!this.adminProducto.name || !this.adminProducto.category || !this.adminProducto.brand) {
        this.mostrar('Completa nombre, categoría y marca', 'red')
        return
      }
      if (!Number(this.adminProducto.price) || Number(this.adminProducto.price) <= 0) {
        this.mostrar('Precio inválido', 'red')
        return
      }
      if (Number(this.adminProducto.stock) < 0) {
        this.mostrar('Stock inválido', 'red')
        return
      }
      const urlImagen = this.adminProducto.image_url?.trim() || ''
      if (urlImagen) {
        const esHttp = /^https?:\/\/.+/i.test(urlImagen)
        const esDataImage = /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(urlImagen)
        if (!esHttp && !esDataImage) {
          this.mostrar('Formato de imagen inválido. Usa URL http/https o data:image base64.', 'red')
          return
        }
        if (esHttp && /google\./i.test(urlImagen) && !/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(urlImagen)) {
          this.mostrar('Ese enlace no es imagen directa. Abre la imagen y copia su URL directa.', 'red')
          return
        }
      }

      this.guardandoAdminProducto = true
      try {
        const esEdicion = !!this.editandoProductoId
        const payload = {
          name: this.adminProducto.name.trim(),
          price: Number(this.adminProducto.price),
          category: this.adminProducto.category,
          brand: this.adminProducto.brand.trim(),
          stock: Number(this.adminProducto.stock || 0),
          image_url: urlImagen || null,
          description: this.adminProducto.description?.trim() || null,
        }
        if (esEdicion) {
          await actualizarProductoAdmin(this.editandoProductoId, payload)
        } else {
          await crearProductoAdmin(payload)
        }
        await this.cargarProductos()
        this.limpiarFormAdminProducto()
        this.mostrar(
          esEdicion ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
          'green',
        )
      } catch (err) {
        this.mostrar(err.message || 'No se pudo guardar el producto', 'red')
      } finally {
        this.guardandoAdminProducto = false
      }
    },
    onPreviewImageError() {
      this.mostrar('La imagen no se pudo cargar. Verifica la URL directa.', 'red')
    },

    traducirError(error) {
      if (error.includes('Password should be at least')) return 'La contraseña debe tener mínimo 6 caracteres'
      if (error.includes('User already registered'))    return 'Este correo ya está registrado'
      if (error.includes('Invalid login credentials'))  return 'Correo o contraseña incorrectos'
      return error
    },

    mostrar(msg, color = 'red') {
      this.mensaje = msg
      this.mensajeColor = color
      this.mostrarMensaje = true
      setTimeout(() => { this.mostrarMensaje = false }, 2500)
    },

    carritoStorageKey() {
      if (!this.carritoCacheUserId) return ''
      return `serviteka_cart_${this.carritoCacheUserId}`
    },

    guardarCarritoLocal() {
      const key = this.carritoStorageKey()
      if (!key) return
      localStorage.setItem(key, JSON.stringify(this.carrito))
    },

    cargarCarritoLocal() {
      const key = this.carritoStorageKey()
      if (!key) return
      const raw = localStorage.getItem(key)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          this.carrito = parsed
          this.unavailableCount = parsed.filter((item) => item.noDisponible).length
        }
      } catch {
        this.carrito = []
      }
    },

    limpiarCarritoLocal() {
      const key = this.carritoStorageKey()
      if (!key) return
      localStorage.removeItem(key)
    },

    async cargarProductos() {
      this.cargando = true
      this.errorCarga = null
      try {
        this.productos = await obtenerProductos()
        this.i = 0
      } catch {
        this.productos = []
        this.errorCarga = 'No se pudieron cargar los productos. ¿Está corriendo el backend?'
      } finally {
        this.cargando = false
      }
    },

    irSiguienteDestacado() {
      if (!this.productos.length) return
      this.i = (this.i + 1) % this.productos.length
    },

    irAnteriorDestacado() {
      if (!this.productos.length) return
      this.i = (this.i - 1 + this.productos.length) % this.productos.length
    },

    async cargarCarritoBackend() {
      if (!this.productos.length) {
        await this.cargarProductos()
      }
      this.cargandoCarrito = true
      try {
        const data = await obtenerCarrito()
        const items = Array.isArray(data.items) ? data.items : []
        this.unavailableCount = 0
        this.carrito = items.map((item) => {
          const prodApi = item.products || null
          const prodCatalogo = this.productos.find((p) => p.id === item.product_id)
          const base = prodCatalogo || (prodApi ? {
            id: prodApi.id,
            nombre: prodApi.name,
            descripcion: prodApi.description || prodApi.name,
            imagen: prodApi.image_url || 'https://via.placeholder.com/150?text=Producto',
            precio: Number(prodApi.price || 0),
            categoria: prodApi.category,
            marca: prodApi.brand,
            stock: prodApi.stock,
          } : null)

          if (!base) {
            this.unavailableCount += 1
            return {
              id: item.product_id,
              nombre: `Producto no disponible (#${item.product_id})`,
              descripcion: 'Este producto ya no está disponible',
              imagen: 'https://via.placeholder.com/150?text=No+Disponible',
              precio: 0,
              cantidad: item.quantity,
              itemId: item.id,
              noDisponible: true,
            }
          }

          const stockActual = Number(base.stock ?? 0)
          const noDisponible = stockActual <= 0 || Number(item.quantity) > stockActual
          if (noDisponible) this.unavailableCount += 1
          return {
            ...base,
            cantidad: item.quantity,
            itemId: item.id,
            noDisponible,
          }
        })

        this.guardarCarritoLocal()
        if (this.unavailableCount > 0) {
          this.mostrar(
            `Hay ${this.unavailableCount} producto(s) no disponible(s) en tu carrito`,
            'red',
          )
        }
      } catch {
        this.carrito = []
        this.unavailableCount = 0
        this.limpiarCarritoLocal()
      } finally {
        this.cargandoCarrito = false
      }
    },
    async cargarMetodosPago() {
      try {
        this.metodosPago = await obtenerMetodosPago()
      } catch {
        this.metodosPago = [
          { id: 'card', name: 'Tarjeta débito/crédito', description: 'Pago seguro con tarjeta' },
          { id: 'pse', name: 'PSE', description: 'Pago desde tu banco' },
          { id: 'cash_on_delivery', name: 'Contraentrega', description: 'Paga al recibir el pedido' }
        ]
      }
      if (!this.metodoPagoSeleccionado && this.metodosPago.length) {
        this.metodoPagoSeleccionado = this.metodosPago[0].id
      }
    },
    async cargarNotificaciones() {
      this.cargandoNotificaciones = true
      try {
        const data = await obtenerNotificaciones()
        this.notificaciones = data.notifications
        this.noLeidasCount = data.unreadCount
      } catch {
        this.notificaciones = []
        this.noLeidasCount = 0
      } finally {
        this.cargandoNotificaciones = false
      }
    },
    async cargarPedidos() {
      this.cargandoPedidos = true
      try {
        this.pedidos = await obtenerPedidos()
      } catch {
        this.pedidos = []
      } finally {
        this.cargandoPedidos = false
      }
    },
    async abrirPedidosDesdePerfil() {
      this.menuUser = false
      await this.cargarPedidos()
      this.vista = 'pedidos'
    },
    iniciarPollingNotificaciones() {
      this.detenerPollingNotificaciones()
      this.pollingNotificaciones = setInterval(() => {
        this.cargarNotificaciones()
      }, 8000)
    },
    detenerPollingNotificaciones() {
      if (!this.pollingNotificaciones) return
      clearInterval(this.pollingNotificaciones)
      this.pollingNotificaciones = null
    },
    toggleNotificaciones() {
      this.mostrarNotificaciones = !this.mostrarNotificaciones
      if (this.mostrarNotificaciones) {
        this.cargarNotificaciones()
      }
    },
    labelTipoNotificacion(type) {
      if (type === 'registration_success') return 'Registro exitoso'
      if (type === 'purchase_confirmed') return 'Compra confirmada'
      if (type === 'purchase_in_transit') return 'Compra en camino'
      if (type === 'purchase_delivered') return 'Compra entregada'
      return 'Notificación'
    },
    formatFecha(value) {
      if (!value) return ''
      return new Date(value).toLocaleString('es-CO')
    },
    renderStars(rating) {
      const value = Math.max(0, Math.min(5, Number(rating || 0)))
      return '★'.repeat(value) + '☆'.repeat(5 - value)
    },
    async abrirNotificacion(noti) {
      if (!noti || noti.is_read) return
      try {
        const updated = await marcarNotificacionLeida(noti.id)
        this.notificaciones = this.notificaciones.map((item) =>
          item.id === updated.id ? updated : item
        )
        this.noLeidasCount = Math.max(this.noLeidasCount - 1, 0)
      } catch {
        this.mostrar('No se pudo marcar la notificación', 'red')
      }
    },
    async abrirDetalleProducto(producto) {
      this.detalle = producto
      await this.cargarResenasProducto(producto.id)
    },
    async cargarResenasProducto(productId) {
      this.cargandoResenas = true
      this.errorResena = ''
      this.miResena = { rating: '', comment: '' }
      this.puedeResenar = false
      try {
        const data = await obtenerResenasProducto(productId)
        this.resenasProducto = data.reviews || []
        this.resumenResenas = data.summary || { count: 0, average: 0 }

        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData.session) {
          const myData = await obtenerEstadoMiResena(productId)
          this.puedeResenar = !!myData.canReview
          if (myData.myReview) {
            this.miResena = {
              rating: myData.myReview.rating,
              comment: myData.myReview.comment,
            }
          }
        }
      } catch (err) {
        this.resenasProducto = []
        this.resumenResenas = { count: 0, average: 0 }
        this.errorResena = err.message || 'No se pudieron cargar las reseñas'
      } finally {
        this.cargandoResenas = false
      }
    },
    async enviarResena() {
      if (!this.detalle?.id) return
      this.guardandoResena = true
      this.errorResena = ''
      try {
        await guardarResena({
          product_id: this.detalle.id,
          rating: Number(this.miResena.rating),
          comment: this.miResena.comment,
        })
        await this.cargarResenasProducto(this.detalle.id)
        this.mostrar('Reseña guardada correctamente', 'green')
      } catch (err) {
        this.errorResena = err.message || 'Ocurrió un error al guardar la reseña'
      } finally {
        this.guardandoResena = false
      }
    },

    async add(p) {
      if (p.noDisponible || Number(p.stock || 0) <= 0) {
        this.mostrar('Este producto no está disponible', 'red')
        return
      }
      const existente = this.carrito.find(c => c.id === p.id)
      if (existente) {
        const prevCantidad = existente.cantidad
        existente.cantidad++
        try {
          if (existente.itemId) {
            await actualizarItem(existente.itemId, existente.cantidad)
          }
          this.guardarCarritoLocal()
        } catch (err) {
          existente.cantidad = prevCantidad
          this.mostrar(err.message || 'No se pudo actualizar el carrito', 'red')
          return
        }
      } else {
        this.carrito.push({ ...p, cantidad: 1 })
        try {
          const res = await agregarItem(p.id, 1)
          const nuevo = this.carrito.find(c => c.id === p.id)
          if (nuevo) nuevo.itemId = res.item?.id
          this.guardarCarritoLocal()
        } catch (err) {
          this.carrito = this.carrito.filter((item) => item.id !== p.id)
          this.mostrar(err.message || 'No se pudo agregar al carrito', 'red')
          return
        }
      }
      this.mostrar(`${p.nombre} agregado al carrito`, 'green')
    },

    async incrementarItem(idx) {
      const item = this.carrito[idx]
      if (!item) return
      if (item.noDisponible) {
        this.mostrar('Este producto no está disponible', 'red')
        return
      }
      const prevCantidad = item.cantidad
      item.cantidad++
      try {
        if (item.itemId) {
          await actualizarItem(item.itemId, item.cantidad)
        }
        this.guardarCarritoLocal()
      } catch (err) {
        item.cantidad = prevCantidad
        this.mostrar(err.message || 'No se pudo actualizar el carrito', 'red')
      }
    },

    async decrementarItem(idx) {
      const item = this.carrito[idx]
      if (!item) return
      if (item.noDisponible) {
        this.mostrar('Elimina el producto no disponible del carrito', 'red')
        return
      }
      if (item.cantidad > 1) {
        const prevCantidad = item.cantidad
        item.cantidad--
        try {
          if (item.itemId) {
            await actualizarItem(item.itemId, item.cantidad)
          }
          this.guardarCarritoLocal()
        } catch (err) {
          item.cantidad = prevCantidad
          this.mostrar(err.message || 'No se pudo actualizar el carrito', 'red')
        }
      } else {
        await this.eliminarItemCarrito(idx)
      }
    },

    async eliminarItemCarrito(idx) {
      const item = this.carrito[idx]
      if (!item) return
      const respaldo = { ...item }
      this.carrito.splice(idx, 1)
      try {
        if (item.itemId) {
          await eliminarItem(item.itemId)
        }
        this.unavailableCount = this.carrito.filter((p) => p.noDisponible).length
        this.guardarCarritoLocal()
      } catch (err) {
        this.carrito.splice(idx, 0, respaldo)
        this.unavailableCount = this.carrito.filter((p) => p.noDisponible).length
        this.mostrar(err.message || 'No se pudo eliminar el producto', 'red')
      }
    },

    validarDireccion() {
      if (!this.direccion.ciudad || !this.direccion.direccion) {
        this.direccionValida = false
        this.errorDireccion = 'Completa ciudad y dirección'
        this.mostrar('Completa ciudad y dirección')
        return
      }
      this.errorDireccion = ''
      this.direccionValida = true
      this.calcularTiempoEntrega(false)
      this.mostrar('Dirección validada. Puedes confirmar tu compra', 'green')
    },

    async calcularTiempoEntrega(force = false) {
      if (!this.direccion.ciudad || !this.direccion.direccion) return
      if (this.calculandoEntrega) return
      if (!force && this.estimacionEntrega && this.estimacionEntrega.calculable) return

      this.calculandoEntrega = true
      this.errorEntrega = ''

      try {
        const data = await estimarEntrega({
          ciudad: this.direccion.ciudad,
          direccion: this.direccion.direccion,
          referencia: this.direccion.referencia
        })
        this.estimacionEntrega = data
        if (!data.calculable) {
          this.errorEntrega = data.message || 'No fue posible calcular el tiempo estimado de entrega.'
        }
      } catch (err) {
        this.estimacionEntrega = null
        this.errorEntrega = err.message || 'No fue posible calcular el tiempo estimado de entrega.'
      } finally {
        this.calculandoEntrega = false
      }
    },

    async irAPago() {
      if (!this.direccionValida) {
        this.mostrar('Debes validar la dirección primero')
        return
      }
      if (this.hasProductosNoDisponibles) {
        this.mostrar('Elimina los productos no disponibles antes de continuar', 'red')
        return
      }
      await this.calcularTiempoEntrega(true)
      this.errorPago = ''
      this.vista = 'pago'
    },

    validarPagoLocal() {
      if (!this.metodoPagoSeleccionado) {
        return 'Selecciona un método de pago'
      }

      if (this.metodoPagoSeleccionado === 'card') {
        const cardNumber = this.pago.cardNumber.replace(/\s/g, '')
        if (!/^\d{13,19}$/.test(cardNumber)) return 'Número de tarjeta inválido'
        if (!this.pago.holder || this.pago.holder.trim().length < 3) return 'Nombre del titular inválido'
        if (!/^\d{2}\/\d{2}$/.test(this.pago.expiry)) return 'Fecha de vencimiento inválida (MM/AA)'
        if (!/^\d{3,4}$/.test(this.pago.cvv)) return 'CVV inválido'
      }

      if (this.metodoPagoSeleccionado === 'pse') {
        if (!this.pago.bank || this.pago.bank.trim().length < 2) return 'Banco inválido'
        if (!/^\d{6,}$/.test(this.pago.document)) return 'Documento inválido'
      }

      return null
    },

    async confirmarCompraConPago() {
      await this.calcularTiempoEntrega(true)
      const errorLocal = this.validarPagoLocal()
      if (errorLocal) {
        this.errorPago = errorLocal
        return
      }

      this.procesandoPago = true
      this.errorPago = ''

      try {
        await procesarPago({
          method: this.metodoPagoSeleccionado,
          details: {
            cardNumber: this.pago.cardNumber,
            holder: this.pago.holder,
            expiry: this.pago.expiry,
            cvv: this.pago.cvv,
            bank: this.pago.bank,
            document: this.pago.document
          },
          delivery: {
            ciudad: this.direccion.ciudad,
            direccion: this.direccion.direccion,
            referencia: this.direccion.referencia,
            estimatedDate: this.estimacionEntrega?.estimatedDate || null,
            estimatedHours: this.estimacionEntrega?.estimatedHours || null,
          },
        })
        await vaciarCarrito()
      } catch (err) {
        this.errorPago = err.message || 'Ocurrió un error al procesar el pago'
        this.procesandoPago = false
        return
      }

      this.carrito = []
      this.direccionValida = false
      this.unavailableCount = 0
      this.estimacionEntrega = null
      this.errorEntrega = ''
      this.pago = { cardNumber: '', holder: '', expiry: '', cvv: '', bank: '', document: '' }
      this.procesandoPago = false
      this.limpiarCarritoLocal()
      await this.cargarNotificaciones()
      await this.cargarPedidos()
      this.mostrar('¡Compra realizada con éxito!', 'green')
      setTimeout(() => { this.vista = 'app' }, 2000)
    },

    async login() {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: this.correo,
          password: this.password
        })
        if (error) throw error
        const { data: sessionData } = await supabase.auth.getSession()
        this.definirRolDesdeSesion(sessionData.session)
        this.carritoCacheUserId = sessionData.session?.user?.id || ''
        this.cargarCarritoLocal()
        await this.cargarCarritoBackend()
        await this.cargarNotificaciones()
        await this.cargarPedidos()
        this.iniciarPollingNotificaciones()
        this.mostrar('Inicio de sesión exitoso', 'green')
        setTimeout(() => { this.mostrarMensaje = false; this.vista = 'app' }, 2000)
      } catch (err) {
        this.mostrar(this.traducirError(err.message))
      }
    },

    async registro() {
      try {
        const { error } = await supabase.auth.signUp({
          email: this.correo,
          password: this.password
        })
        if (error) throw error
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert([{ name: this.correo.split('@')[0], email: this.correo }])
        if (insertError) throw insertError
        this.mostrar('Usuario creado correctamente', 'green')
        setTimeout(() => { this.mostrarMensaje = false; this.vista = 'login' }, 2000)
      } catch (err) {
        this.mostrar(this.traducirError(err.message))
      }
    },

    async logout() {
      try { await vaciarCarrito() } catch {}
      await supabase.auth.signOut()
      this.carrito = []
      this.unavailableCount = 0
      this.limpiarCarritoLocal()
      this.carritoCacheUserId = ''
      this.isAdmin = false
      this.detenerPollingNotificaciones()
      this.notificaciones = []
      this.noLeidasCount = 0
      this.mostrarNotificaciones = false
      this.pedidos = []
      this.cargandoPedidos = false
      this.metodoPagoSeleccionado = ''
      this.estimacionEntrega = null
      this.errorEntrega = ''
      this.pago = { cardNumber: '', holder: '', expiry: '', cvv: '', bank: '', document: '' }
      this.errorPago = ''
      this.resenasProducto = []
      this.resumenResenas = { count: 0, average: 0 }
      this.puedeResenar = false
      this.miResena = { rating: '', comment: '' }
      this.vista = 'inicio'
      this.mostrar('Sesión cerrada', 'green')
    }
  }
}
</script>
