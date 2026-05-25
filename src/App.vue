<template>

  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>

  <!-- INICIO -->
  <div v-if="vista === 'inicio'" class="inicio">
    <div
      class="cardInicio cardInicioInteractiva"
      :style="estiloCardInicioInteractiva()"
      @mousemove="moverCardInicio"
      @mouseleave="resetCardInicio"
    >
      <p class="inicioTag">SERVITECA ONLINE</p>
      <h1>TALLER AL VOLANTE</h1>
      <p class="inicioLead">Repuestos, mantenimiento y compra segura en un solo lugar.</p>

      <div class="inicioPuntos">
        <span>Entrega rápida</span>
        <span>Pago protegido</span>
        <span>Soporte experto</span>
      </div>

      <div class="inicioAcciones">
        <button class="btn btnMagnetico" :style="estiloBotonInicio(1)" @click="irARutaAuth('login')">Iniciar sesión</button>
        <button class="btn register btnMagnetico" :style="estiloBotonInicio(-1)" @click="irARutaAuth('registro')">Registrarse</button>
      </div>
    </div>
  </div>

  <!-- LOGIN -->
  <div v-else-if="vista === 'login'" class="auth authPremium">
    <div class="authShell">
      <section class="authPanel authInfoPanel">
        <p class="authKicker">SERVICIO PREMIUM</p>
        <h2>Accede a tu taller digital</h2>
        <p>Gestiona tus compras, pedidos y seguimiento técnico en un solo lugar.</p>
        <div class="authBadges">
          <span>Pago protegido</span>
          <span>Pedidos en tiempo real</span>
          <span>Soporte experto</span>
        </div>
      </section>

      <section class="authPanel authFormPanel">
        <h2>Iniciar sesión</h2>
        <p class="authSubtitle">Ingresa con tu cuenta para continuar.</p>

        <label class="authLabel">Correo electrónico</label>
        <div class="authInputWrap">
          <Mail class="authIcon" />
          <input v-model="correo" placeholder="tu_correo@ejemplo.com">
        </div>

        <label class="authLabel">Contraseña</label>
        <div class="authInputWrap">
          <Lock class="authIcon" />
          <input type="password" v-model="password" placeholder="Tu contraseña">
        </div>

        <button class="authMainBtn" @click="login">Entrar</button>

        <p @click="irARutaAuth('registro')" class="link authSwitchLink">
          ¿No tienes cuenta? Regístrate
        </p>
      </section>
    </div>
  </div>

  <!-- REGISTRO -->
  <div v-else-if="vista === 'registro'" class="auth authPremium">
    <div class="authShell">
      <section class="authPanel authInfoPanel">
        <p class="authKicker">CUENTA NUEVA</p>
        <h2>Únete y compra mejor</h2>
        <p>Regístrate para guardar tus datos, acelerar compras y llevar historial de pedidos.</p>
        <div class="authBadges">
          <span>Registro rápido</span>
          <span>Datos protegidos</span>
          <span>Atención prioritaria</span>
        </div>
      </section>

      <section class="authPanel authFormPanel">
        <h2>Crear cuenta</h2>
        <p class="authSubtitle">Completa tus datos para comenzar.</p>

        <label class="authLabel">Nombre completo</label>
        <div class="authInputWrap">
          <User class="authIcon" />
          <input v-model="nombreRegistro" placeholder="Nombre completo">
        </div>

        <label class="authLabel">Teléfono</label>
        <div class="authInputWrap">
          <Phone class="authIcon" />
          <input v-model="telefonoRegistro" placeholder="Teléfono">
        </div>

        <label class="authLabel">Correo electrónico</label>
        <div class="authInputWrap">
          <Mail class="authIcon" />
          <input v-model="correo" placeholder="tu_correo@ejemplo.com">
        </div>

        <label class="authLabel">Contraseña</label>
        <div class="authInputWrap">
          <Lock class="authIcon" />
          <input type="password" v-model="password" placeholder="Contraseña">
        </div>

        <label class="authLabel">Confirmar contraseña</label>
        <div class="authInputWrap">
          <ShieldCheck class="authIcon" />
          <input type="password" v-model="confirmPassword" placeholder="Confirmar contraseña">
        </div>

        <button class="authMainBtn" @click="registro">Registrarse</button>

        <p @click="irARutaAuth('login')" class="link authSwitchLink">
          ¿Ya tienes cuenta? Inicia sesión
        </p>
      </section>
    </div>
  </div>

  <!-- CARRITO -->
  <div v-else-if="vista === 'carrito'" class="checkoutWrap">
    <section class="checkoutStepper">
      <div class="checkoutProgress" style="--progress: 25%;"></div>
      <span class="step activo">🛒 1. Carrito</span>
      <span class="step">📍 2. Dirección</span>
      <span class="step">💳 3. Pago</span>
      <span class="step">✅ 4. Confirmación</span>
    </section>
    <CarritoView
      :carrito="carrito"
      :total="total"
      :bloquear-continuar="hasProductosNoDisponibles"
      @volver="irAVista('app')"
      @incrementar="incrementarItem($event)"
      @decrementar="decrementarItem($event)"
      @eliminar="eliminarItemCarrito($event)"
      @login="irAVista('login')"
      @direccion="irAVista('direccion')"
    />
  </div>

  <!-- DIRECCIÓN (NUEVO SIN ROMPER ESTILOS) -->
  <div v-else-if="vista === 'direccion'" class="auth">
    <div class="cardAuth">
      <section class="checkoutStepper">
        <div class="checkoutProgress" style="--progress: 50%;"></div>
        <span class="step done">🛒 1. Carrito</span>
        <span class="step activo">📍 2. Dirección</span>
        <span class="step">💳 3. Pago</span>
        <span class="step">✅ 4. Confirmación</span>
      </section>

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
      <section class="checkoutStepper">
        <div class="checkoutProgress" style="--progress: 75%;"></div>
        <span class="step done">🛒 1. Carrito</span>
        <span class="step done">📍 2. Dirección</span>
        <span class="step activo">💳 3. Pago</span>
        <span class="step">✅ 4. Confirmación</span>
      </section>
      <h2>MÉTODO DE PAGO</h2>

      <div v-if="!metodosPago.length" class="emptyProductos">
        <h4>No hay métodos de pago disponibles</h4>
        <p>Intenta recargar los métodos para continuar.</p>
        <button class="btnLimpiarFiltros" @click="cargarMetodosPago">Recargar métodos</button>
      </div>

      <div v-else class="metodosPago">
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

      <button class="btnSecundario" @click="irAVista('direccion')">
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

      <button class="btnSecundario" @click="cargarPedidos">
        Actualizar pedidos
      </button>

      <p v-if="cargandoPedidos">Cargando pedidos...</p>
      <div v-else-if="!pedidos.length" class="adminVacio">
        No tienes pedidos registrados todavía. Cuando compres, aquí verás su estado.
      </div>

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
      <h2>PANEL ADMIN</h2>
      <div class="adminLayout">
      <aside class="adminSidebar" :class="{ colapsado: adminSidebarCollapsed }">
        <button class="adminCollapseBtn" @click="adminSidebarCollapsed = !adminSidebarCollapsed">
          {{ adminSidebarCollapsed ? 'Expandir menú' : 'Colapsar menú' }}
        </button>
        <button class="adminAccordionBtn" :class="{ activo: adminSeccionActiva === 'dashboard' }" @click="toggleSeccionAdmin('dashboard')">
          <LayoutDashboard class="adminNavIcon" />
          <span v-if="!adminSidebarCollapsed">Dashboard</span>
        </button>
        <button class="adminAccordionBtn" :class="{ activo: adminSeccionActiva === 'productos' }" @click="toggleSeccionAdmin('productos')">
          <Boxes class="adminNavIcon" />
          <span v-if="!adminSidebarCollapsed">Productos</span>
        </button>
        <button class="adminAccordionBtn" :class="{ activo: adminSeccionActiva === 'usuarios' }" @click="toggleSeccionAdmin('usuarios')">
          <Users class="adminNavIcon" />
          <span v-if="!adminSidebarCollapsed">Usuarios</span>
        </button>
      </aside>

      <main class="adminContent">
      <section v-if="adminSeccionActiva === 'productos'" class="adminSection">
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
        <div class="adminGrid">
          <input
            ref="inputImagenProducto"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            @change="subirImagenProductoDesdeArchivo"
          >
          <button
            class="btnSecundario"
            :disabled="subiendoImagenAdmin"
            @click="$refs.inputImagenProducto && $refs.inputImagenProducto.click()"
          >
            {{ subiendoImagenAdmin ? 'Subiendo imagen...' : 'Subir imagen a Storage' }}
          </button>
        </div>
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

        <div class="adminFormActions">
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
      </div>

      <div class="adminLista">
        <h3>Productos existentes</h3>
        <div class="adminListaControles">
          <input v-model="buscarProductoAdmin" placeholder="Buscar por nombre o marca">
          <select v-model="filtroCategoriaAdmin">
            <option value="">Todas las categorías</option>
            <option v-for="c in categoriasDisponibles.filter(Boolean)" :key="`f-${c}`" :value="c">{{ c }}</option>
          </select>
          <select v-model="ordenProductoAdmin">
            <option value="nombre_asc">Nombre A-Z</option>
            <option value="nombre_desc">Nombre Z-A</option>
            <option value="precio_asc">Precio menor a mayor</option>
            <option value="precio_desc">Precio mayor a menor</option>
          </select>
        </div>
        <label class="adminToggleTodos">
          <input type="checkbox" v-model="mostrarTodosProductosAdmin">
          Mostrar todos (todas las categorías)
        </label>
        <p class="adminConteo">Mostrando {{ productosAdminFiltrados.length }} producto(s)</p>
        <div v-if="cargando" class="adminSkeletonGrid">
          <div v-for="n in 6" :key="`psk-${n}`" class="adminSkeletonLine"></div>
        </div>
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
              <tr v-for="p in productosAdminPaginados" :key="p.id">
                <td>{{ p.nombre }}</td>
                <td>{{ p.categoria }}</td>
                <td>${{ Number(p.precio || 0).toLocaleString() }}</td>
                <td>{{ p.stock }}</td>
                <td class="accionesAdmin">
                  <button class="btnEditarAdmin" @click="editarProductoDesdeLista(p)">Editar</button>
                  <button class="btnEliminarAdmin" @click="eliminarProductoDesdeLista(p)">Eliminar</button>
                </td>
              </tr>
              <tr v-if="productosAdminFiltrados.length === 0">
                <td colspan="5" class="adminVacio">Activa “Mostrar todos”, o escribe en buscar, o aplica un filtro.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="productosAdminTotalPaginas > 1" class="adminPaginator">
          <button class="btnSecundario" :disabled="adminProductosPagina === 1" @click="adminProductosPagina--">Anterior</button>
          <span>Página {{ adminProductosPagina }} de {{ productosAdminTotalPaginas }}</span>
          <button class="btnSecundario" :disabled="adminProductosPagina === productosAdminTotalPaginas" @click="adminProductosPagina++">Siguiente</button>
        </div>
      </div>
      </section>

      <section v-else-if="adminSeccionActiva === 'dashboard'" class="adminSection" v-motion-slide-visible-once-bottom>
        <div v-if="cargando" class="adminSkeletonGrid">
          <div v-for="n in 4" :key="`dsk-${n}`" class="adminSkeletonCard"></div>
        </div>
        <div v-else class="adminStatsGrid">
          <div class="adminStatCard">
            <small>Productos</small>
            <strong>{{ adminMetricas.totalProductos }}</strong>
          </div>
          <div class="adminStatCard">
            <small>Stock bajo (<=5)</small>
            <strong>{{ adminMetricas.stockBajo }}</strong>
          </div>
          <div class="adminStatCard">
            <small>Pedidos</small>
            <strong>{{ adminMetricas.totalPedidos }}</strong>
          </div>
          <div class="adminStatCard">
            <small>Ventas estimadas</small>
            <strong>{{ formatPrecio(adminMetricas.ventasEstimadas) }}</strong>
          </div>
        </div>
        <div class="adminLista adminChartCard">
          <h3>Stock por categoría</h3>
          <apexchart
            type="bar"
            height="320"
            :options="dashboardStockOptions"
            :series="dashboardStockSeries"
          />
        </div>
        <div class="adminLista">
          <h3>Top productos por stock</h3>
          <div class="adminTopStockGrid">
            <button v-for="p in masVendidos" :key="`dash-${p.id}`">{{ p.nombre }} ({{ p.stock }})</button>
          </div>
        </div>
        <div class="adminDashGrid">
          <div class="adminLista">
            <h3>Alertas de stock bajo</h3>
            <div v-if="!productosStockBajo.length" class="adminVacio">Sin alertas de stock.</div>
            <div v-else class="adminAlertList">
              <div v-for="p in productosStockBajo" :key="`low-${p.id}`" class="adminAlertItem">
                <strong>{{ p.nombre }}</strong>
                <span>{{ p.categoria }} · stock: {{ p.stock }}</span>
              </div>
            </div>
          </div>
          <div class="adminLista">
            <h3>Pedidos recientes</h3>
            <div v-if="!pedidosRecientes.length" class="adminVacio">Aún no hay pedidos para mostrar.</div>
            <div v-else class="tablaAdminWrap">
              <table class="tablaAdmin tablaCompacta">
                <thead>
                  <tr>
                    <th># Pedido</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pedido in pedidosRecientes" :key="`rec-${pedido.id}`">
                    <td>#{{ pedido.order_number || 'N/A' }}</td>
                    <td><span class="estadoBadge">{{ pedido.status || 'pendiente' }}</span></td>
                    <td>${{ Number(pedido.total_amount || 0).toLocaleString() }}</td>
                    <td>{{ formatFecha(pedido.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="adminSeccionActiva === 'usuarios'" class="adminSection">
        <div class="adminForm">
          <input v-model="buscarUsuarioAdmin" placeholder="Buscar por nombre o correo">
          <button class="btnSecundario" :disabled="cargandoUsuariosAdmin" @click="cargarUsuariosAdmin">
            {{ cargandoUsuariosAdmin ? 'Actualizando...' : 'Actualizar usuarios' }}
          </button>
        </div>
        <div class="adminLista">
          <h3>Usuarios registrados</h3>
          <div v-if="cargandoUsuariosAdmin" class="adminSkeletonGrid">
            <div v-for="n in 6" :key="`usk-${n}`" class="adminSkeletonLine"></div>
          </div>
          <div v-else-if="!usuariosAdminFiltrados.length" class="adminVacio">No se encontraron usuarios.</div>
          <div v-else class="tablaAdminWrap">
            <table class="tablaAdmin">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in usuariosAdminPaginados" :key="u.id">
                  <td>{{ u.name || '—' }}</td>
                  <td>{{ u.email || '—' }}</td>
                  <td>{{ formatFecha(u.created_at) }}</td>
                  <td class="accionesAdmin">
                    <button class="btnEliminarAdmin" @click="eliminarUsuarioAdmin(u)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="usuariosAdminTotalPaginas > 1" class="adminPaginator">
            <button class="btnSecundario" :disabled="adminUsuariosPagina === 1" @click="adminUsuariosPagina--">Anterior</button>
            <span>Página {{ adminUsuariosPagina }} de {{ usuariosAdminTotalPaginas }}</span>
            <button class="btnSecundario" :disabled="adminUsuariosPagina === usuariosAdminTotalPaginas" @click="adminUsuariosPagina++">Siguiente</button>
          </div>
        </div>
      </section>
      </main>
      </div>
    </div>
  </div>

  <div v-else-if="vista === 'adminDashboard'" class="auth">
    <div class="cardAuth adminCard">
      <h2>DASHBOARD ADMIN</h2>
      <div class="adminNav">
        <button class="btnSecundario" @click="abrirPanelAdmin">Panel productos</button>
        <button class="btnSecundario" @click="abrirUsuariosAdmin">Gestionar usuarios</button>
      </div>
      <div class="adminStatsGrid">
        <div class="adminStatCard">
          <small>Productos</small>
          <strong>{{ adminMetricas.totalProductos }}</strong>
        </div>
        <div class="adminStatCard">
          <small>Stock bajo (<=5)</small>
          <strong>{{ adminMetricas.stockBajo }}</strong>
        </div>
        <div class="adminStatCard">
          <small>Pedidos</small>
          <strong>{{ adminMetricas.totalPedidos }}</strong>
        </div>
        <div class="adminStatCard">
          <small>Ventas estimadas</small>
          <strong>{{ formatPrecio(adminMetricas.ventasEstimadas) }}</strong>
        </div>
      </div>
      <div class="adminLista">
        <h3>Top productos por stock</h3>
        <div class="chipsRecomendados">
          <button v-for="p in masVendidos" :key="`dash-${p.id}`">{{ p.nombre }} ({{ p.stock }})</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="vista === 'adminUsuarios'" class="auth">
    <div class="cardAuth adminCard">
      <h2>PANEL ADMIN - USUARIOS</h2>
      <div class="adminNav">
        <button class="btnSecundario" @click="abrirDashboardAdmin">Ir a dashboard</button>
        <button class="btnSecundario" @click="abrirPanelAdmin">Panel productos</button>
      </div>
      <div class="adminForm">
        <input v-model="buscarUsuarioAdmin" placeholder="Buscar por nombre o correo">
        <button class="btnSecundario" :disabled="cargandoUsuariosAdmin" @click="cargarUsuariosAdmin">
          {{ cargandoUsuariosAdmin ? 'Actualizando...' : 'Actualizar usuarios' }}
        </button>
      </div>

      <div class="adminLista">
        <h3>Usuarios registrados</h3>
        <div v-if="cargandoUsuariosAdmin">Cargando usuarios...</div>
        <div v-else-if="!usuariosAdminFiltrados.length" class="adminVacio">No se encontraron usuarios.</div>
        <div v-else class="tablaAdminWrap">
          <table class="tablaAdmin">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in usuariosAdminFiltrados" :key="u.id">
                <td>{{ u.name || '—' }}</td>
                <td>{{ u.email || '—' }}</td>
                <td>{{ formatFecha(u.created_at) }}</td>
                <td class="accionesAdmin">
                  <button class="btnEliminarAdmin" @click="eliminarUsuarioAdmin(u)">Eliminar</button>
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

    <section class="topBar">
      <span>Envío gratis</span>
      <span>Pago 100% seguro</span>
    </section>

    <header class="header" :class="{ headerElevated }">
      <h1 class="titulo">Taller El Volante</h1>

      <div class="acciones">

        <button class="btnGrande btnHeader btnUsuario btnZonaCuenta" @click="menuUser = !menuUser">
          <span>👤</span>
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

        <button
          class="btnGrande btnHeader btnSecundarioHeader btnFiltroHeader btnZonaFiltros"
          :class="{ activo: showM && panelLateralActivo === 'filtros' }"
          @click="toggleFiltros"
        >
          Filtrar
        </button>

        <button class="btnGrande btnHeader btnNoti btnZonaCuenta" @click="toggleNotificaciones">
          🔔
          <span v-if="noLeidasCount" class="badgeNoti">{{ noLeidasCount }}</span>
        </button>

        <button class="btnGrande btnHeader btnZonaCuenta" @click="abrirFavoritos">
          ⭐ ({{ favoritosIds.length }})
        </button>
        <button class="btnGrande btnHeader btnZonaCuenta" :disabled="comparacionIds.length < 2" @click="abrirComparacion">
          Comparar ({{ comparacionIds.length }})
        </button>
        <button
          class="btnGrande btnHeader btnSecundarioHeader btnCategoriasHeader btnZonaFiltros"
          :class="{ activo: showM && panelLateralActivo === 'categorias' }"
          @click="toggleCategorias"
        >
          Categorías
        </button>

        <button class="btnGrande btnHeader btnCarritoHeader btnZonaCompra" @click="irAVista('carrito')">
          🛒 ({{ totalItems }})
        </button>

      </div>
    </header>

    <section class="heroVentas">
      <div class="heroTexto">
        <p class="heroTag">OFERTAS DE TEMPORADA</p>
        <h2>Repuestos confiables con mejor precio</h2>
        <p>Compra rápido, paga seguro y recibe en casa.</p>
        <div class="heroAcciones">
          <button class="btnHeroPrimario" @click="irAComprarDesdeHero">Comprar ahora</button>
          <button class="btnHeroSecundario" @click="verCategoriasDesdeHero">Ver categorías</button>
        </div>
      </div>
      <div class="heroStats">
        <div><strong>{{ productos.length }}</strong><small>productos</small></div>
        <div><strong>{{ totalItems }}</strong><small>en carrito</small></div>
        <div><strong>Compra</strong><small>segura</small></div>
      </div>
    </section>

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

    <section class="buscador" ref="seccionCatalogo">
      <input v-model="buscar" placeholder="Buscar..." />
    </section>

    <section class="miniResumen" v-if="totalItems">
      <span>{{ totalItems }} producto(s) en carrito</span>
      <strong>Subtotal: ${{ total.toLocaleString() }}</strong>
      <button @click="irAVista('carrito')">Ir al carrito</button>
    </section>

    <div class="layout">

      <aside class="menu" v-if="showM" ref="panelCategorias">
        <h3>Categorías</h3>
        <br>
        <div class="filtrosPanel" v-if="panelLateralActivo === 'filtros'">
          <input v-model="filtroNombre" type="text" placeholder="Buscar por nombre" />
          <select v-model="filtroCategoria">
            <option value="">Todas las categorías</option>
            <option v-for="c in categoriasDisponibles.filter(Boolean)" :key="`f-${c}`" :value="c">{{ c }}</option>
          </select>
          <div class="filaFiltro">
            <input v-model.number="filtroPrecioMin" type="number" min="0" placeholder="Precio mín." />
            <input v-model.number="filtroPrecioMax" type="number" min="0" placeholder="Precio máx." />
          </div>
          <label class="checkFiltro">
            <input type="checkbox" v-model="soloDisponibles" />
            Solo disponibles
          </label>
          <select v-model="ordenProductos">
            <option value="default">Ordenar: recomendado</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="name_asc">Nombre: A-Z</option>
            <option value="name_desc">Nombre: Z-A</option>
          </select>
          <button class="btnLimpiarFiltros" @click="limpiarFiltros">Limpiar filtros</button>
        </div>
        <div class="listaCategorias" v-if="panelLateralActivo === 'categorias'">
          <button
            class="categoria"
            v-for="c in categoriasDisponibles"
            :key="c"
            @click="cat = c"
          >
            {{ c || 'Todos' }}
          </button>
        </div>
      </aside>

      <main class="contenido">

        <section v-if="!cat && productoActual" class="destacado">
          <button class="flecha"
            @click="irAnteriorDestacado">
            ◀
          </button>

          <div class="cardGrande">
            <img :src="productoActual.imagen">

            <h2>{{ productoActual.nombre }}</h2>
            <p class="desc">{{ productoActual.descripcion }}</p>
            <p class="precio">{{ formatPrecio(productoActual.precio) }}</p>

            <button class="agregar" @click="add(productoActual)">
              Agregar al carrito
            </button>
          </div>

          <button class="flecha"
            @click="irSiguienteDestacado">
            ▶
          </button>
        </section>
        <section v-else-if="!cat" class="destacado">
          <p>No hay productos disponibles en este momento.</p>
        </section>

        <section class="productos">
          <div v-if="cargando" class="productosSkeleton">
            <div class="cardSkeleton" v-for="n in 6" :key="`sk-${n}`"></div>
          </div>
          <div v-else-if="!filtrados.length" class="emptyProductos">
            <h4>Sin resultados para tus filtros</h4>
            <p>Prueba con otra categoría, nombre o rango de precio.</p>
            <button class="btnLimpiarFiltros" @click="limpiarFiltros">Limpiar filtros</button>
          </div>
          <div v-else class="card" v-for="p in filtrados" :key="p.id" @click="abrirDetalleProducto(p)">

            <div v-if="p.etiqueta" class="etiqueta">{{ p.etiqueta }}</div>

            <img :src="p.imagen">
            <div class="badgesProducto" v-if="badgesProducto(p).length">
              <span
                v-for="b in badgesProducto(p)"
                :key="`${p.id}-${b}`"
                class="badgeProducto"
              >
                {{ b }}
              </span>
            </div>
            <h3>{{ p.nombre }}</h3>
            <p class="desc">{{ p.descripcion }}</p>
            <p class="precio">{{ formatPrecio(p.precio) }}</p>

            <div class="accionesCard">
              <button class="agregar" @click.stop="add(p)">Agregar</button>
              <button class="btnMini" @click.stop="toggleFavorito(p)">
                {{ esFavorito(p.id) ? '★' : '☆' }}
              </button>
              <button class="btnMini" @click.stop="toggleComparacion(p)">
                {{ enComparacion(p.id) ? 'Quitar' : 'Comparar' }}
              </button>
            </div>

          </div>
        </section>

        <section class="bloqueRecomendados" v-if="masVendidos.length">
          <h3>Más vendidos</h3>
          <div class="chipsRecomendados">
            <button
              v-for="p in masVendidos"
              :key="`top-${p.id}`"
              @click="abrirDetalleProducto(p)"
            >
              {{ p.nombre }} - ${{ Number(p.precio || 0).toLocaleString() }}
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
        <p class="precio">{{ formatPrecio(detalle.precio) }}</p>

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

    <div v-if="comparacionAbierta" class="modal" @click.self="comparacionAbierta = false">
      <div class="modalContenido">
        <h2>Comparación de productos</h2>
        <div class="comparacionGrid" v-if="productosComparacion.length">
          <div class="itemComparacion" v-for="p in productosComparacion" :key="`cmp-${p.id}`">
            <img :src="p.imagen" :alt="p.nombre" />
            <h4>{{ p.nombre }}</h4>
            <p>{{ p.categoria }}</p>
            <p>{{ formatPrecio(p.precio) }}</p>
            <p>Stock: {{ p.stock }}</p>
          </div>
        </div>
        <button class="cerrar" @click="comparacionAbierta = false">Cerrar</button>
      </div>
    </div>

    <footer class="footerSite">
      <div class="footerGrid">
        <div>
          <h4>Taller El Volante</h4>
          <p>Repuestos y servicio automotriz con atención profesional.</p>
        </div>
        <div>
          <h4>Atención</h4>
          <p>Lun - Sáb: 8:00 AM - 6:00 PM</p>
          <p>soporte@tallerelvolante.com</p>
        </div>
        <div>
          <h4>Ubicación</h4>
          <p>Cali, Colombia</p>
          <p>Servicio en taller y domicilio</p>
        </div>
      </div>
      <small>© {{ new Date().getFullYear() }} Taller El Volante. Todos los derechos reservados.</small>
    </footer>

  </div>

</template>



  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Sora:wght@600;700;800&display=swap');

  :global(:root) {
    --bg-soft: #f3f6fb;
    --surface: #ffffff;
    --text-main: #0f172a;
    --text-soft: #475569;
    --line-soft: #dbe3ef;
    --brand-700: #1e3a8a;
    --brand-900: #0b1220;
  }

  :global(body) {
    font-family: 'Manrope', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    color: var(--text-main);
    background: var(--bg-soft);
  }

  :global(h1), :global(h2), :global(h3), :global(h4) {
    font-family: 'Sora', 'Manrope', sans-serif;
    letter-spacing: -0.01em;
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .presentacion {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background:
      linear-gradient(rgba(7, 10, 18, 0.62), rgba(7, 10, 18, 0.62)),
      url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1800&q=80') center/cover no-repeat;
  }
  .presentacionCentro {
    max-width: 680px;
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 20px;
    padding: 34px 28px;
    box-shadow: 0 28px 48px rgba(2, 6, 23, 0.4);
    backdrop-filter: blur(4px);
  }
  .presentacionCentro h1 {
    margin: 0 0 10px;
    font-size: 42px;
    line-height: 1.05;
    color: #0b1220;
  }
  .presentacionCentro p {
    margin: 0;
    color: #334155;
    font-size: 16px;
    line-height: 1.5;
  }
  .btnPresentacion {
    margin-top: 18px;
    border: 1px solid #0b1220;
    background: #0b1220;
    color: #fff;
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
  }
  .btnPresentacion:hover {
    background: #1f2937;
  }
  .btnEsquina {
    position: absolute;
    top: 18px;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    background: rgba(255, 255, 255, 0.95);
    color: #0f172a;
    padding: 9px 12px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.2);
  }
  .btnEsquina:hover {
    border-color: var(--accent-500);
    color: var(--accent-600);
    background: #fff;
  }
  .btnEsquinaIzq { left: 18px; }
  .btnEsquinaDer { right: 18px; }
  :global(body) {
    margin: 0;
    font-family: "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif;
    background: #eef2f7;
    color: #0f172a;
  }
  :global(:root) {
    --brand-900: #0f172a;
    --brand-700: #1e293b;
    --accent-500: #0ea5e9;
    --accent-600: #0284c7;
    --accent-50: #f0f9ff;
    --surface: #ffffff;
    --border-soft: #dbe3ef;
    --text-muted: #475569;
  }

  .mensaje {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #0f172a;
    color: white;
    padding: 12px 22px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.2);
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
    background:
      linear-gradient(rgba(7, 10, 18, 0.68), rgba(7, 10, 18, 0.68)),
      url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1800&q=80') center/cover no-repeat;
  }

  .cardInicio {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background: rgba(255, 255, 255, 0.92);
    padding: 40px 34px;
    width: min(520px, 90vw);
    border-radius: 20px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow: 0 28px 50px rgba(2, 6, 23, 0.42);
    backdrop-filter: blur(6px);
  }
  .cardInicioInteractiva {
    transition: transform 0.14s ease, box-shadow 0.2s ease, background 0.15s ease;
    transform-style: preserve-3d;
    will-change: transform;
    position: relative;
    isolation: isolate;
  }
  .cardInicioInteractiva::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 22px;
    z-index: -1;
    background:
      radial-gradient(circle at var(--lx, 50%) var(--ly, 50%), rgba(14, 165, 233, 0.5), rgba(14, 165, 233, 0.06) 35%, rgba(14, 165, 233, 0) 62%);
    filter: blur(10px);
    opacity: 0.9;
    transition: opacity 0.18s ease;
  }
  .inicioTag {
    margin: 0;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #0b1220;
    background: #fbbf24;
    border: 1px solid #f59e0b;
    border-radius: 999px;
    padding: 6px 10px;
  }
  .cardInicio h1 {
    margin: 0;
    font-size: 34px;
    line-height: 1.1;
    color: #0b1220;
  }
  .inicioLead {
    margin: 0;
    color: #1f2937;
    font-size: 15px;
  }
  .inicioPuntos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
  .inicioPuntos span {
    font-size: 12px;
    font-weight: 700;
    color: #0b1220;
    border: 1px solid #cbd5e1;
    background: rgba(248, 250, 252, 0.95);
    border-radius: 999px;
    padding: 6px 10px;
  }
  .inicioAcciones {
    width: 100%;
    margin-top: 6px;
  }

  .btn,
  .register,
  .ghost {
    border: 1px solid #d1d5db;
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    background-color: #0b1220;
    display: block;
    width: 100%;
    margin: 6px 0;
    padding: 12px;
    transition: all 0.2s ease;
  }

  .btn:hover,
  .register:hover,
  .ghost:hover {
    transform: translateY(-1px);
    color: #fff;
    background-color: #1f2937;
  }
  .btnMagnetico {
    transition: transform 0.12s ease, box-shadow 0.18s ease, background-color 0.2s ease;
    will-change: transform;
  }
  .btnMagnetico:hover {
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.22);
  }

  .register {
    background: #f59e0b;
    border-color: #d97706;
    color: #111827;
  }


  /* auth */
  .auth {
    min-height: 100vh;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background:
      radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.18), transparent 44%),
      radial-gradient(circle at 85% 75%, rgba(20, 184, 166, 0.16), transparent 44%),
      #f3f6fb;
    overflow-y: auto;
    padding: 24px 12px;
  }
  .authPremium {
    align-items: center;
  }
  .authShell {
    width: min(1040px, 96vw);
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid #dbe3ef;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(2, 6, 23, 0.2);
    background: #fff;
  }
  .authPanel {
    padding: 34px 30px;
  }
  .authInfoPanel {
    color: #dbeafe;
    background:
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.5), transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.35), transparent 45%),
      linear-gradient(140deg, #0b1220, #1e3a8a);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }
  .authKicker {
    margin: 0;
    display: inline-block;
    width: fit-content;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.26);
  }
  .authInfoPanel h2 {
    margin: 0;
    color: #f8fafc;
    font-size: 30px;
    line-height: 1.1;
  }
  .authInfoPanel p {
    margin: 0;
    color: #cbd5e1;
    font-size: 15px;
  }
  .authBadges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }
  .authBadges span {
    font-size: 12px;
    font-weight: 700;
    color: #e2e8f0;
    border: 1px solid rgba(226, 232, 240, 0.35);
    border-radius: 999px;
    padding: 6px 10px;
    background: rgba(15, 23, 42, 0.28);
  }
  .authFormPanel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #fff;
  }
  .authFormPanel h2 {
    margin: 0;
    color: #0f172a;
    font-size: 28px;
  }
  .authSubtitle {
    margin: 0 0 6px;
    color: #475569;
    font-size: 14px;
  }
  .authLabel {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
  }
  .authInputWrap {
    display: grid;
    grid-template-columns: 34px 1fr;
    align-items: center;
    border: 1px solid #d0dbe8;
    border-radius: 10px;
    background: #f8fafc;
    padding: 0 10px;
    transition: all 0.18s ease;
  }
  .authInputWrap:focus-within {
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
  .authInputWrap span {
    color: #334155;
    font-size: 15px;
  }
  .authIcon {
    width: 16px;
    height: 16px;
    color: #334155;
    stroke-width: 2.2;
  }
  .authInputWrap input {
    border: none;
    background: transparent;
    padding: 12px 0;
    font-size: 14px;
    outline: none;
    width: 100%;
  }
  .authMainBtn {
    margin-top: 8px;
    border: 1px solid #0f172a;
    border-radius: 10px;
    background: linear-gradient(135deg, #0f172a, #1e293b);
    color: #fff;
    font-weight: 800;
    font-size: 15px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .authMainBtn:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 24px rgba(15, 23, 42, 0.25);
  }
  .authSwitchLink {
    margin-top: 4px;
    color: #334155;
  }

  .cardAuth {
    display: flex;
    border: 1px solid #dbe3ef;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background: #ffffff;
    padding: 30px;
    border-radius: 16px;
    width: 300px;
    margin: 0 auto;
  }
  @media (max-width: 900px) {
    .authShell {
      grid-template-columns: 1fr;
    }
    .authInfoPanel {
      padding: 26px 24px;
    }
    .authFormPanel {
      padding: 24px;
    }
    .authInfoPanel h2 {
      font-size: 24px;
    }
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
    width: 1120px;
    max-width: 98vw;
    align-items: stretch;
  }
  .adminNav {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .adminLayout {
    width: 100%;
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 14px;
    align-items: start;
  }
  .adminSidebar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: sticky;
    top: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px;
  }
  .adminSidebar.colapsado {
    width: 76px;
    justify-self: start;
  }
  .adminCollapseBtn {
    border: 1px solid #cbd5e1;
    background: #fff;
    color: #334155;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }
  .adminContent {
    min-width: 0;
    min-height: 65vh;
  }
  .adminSection {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .adminAccordionBtn {
    border: 1px solid #d1d9e6;
    background: #fff;
    color: #0f172a;
    border-radius: 8px;
    padding: 11px 12px;
    font-weight: 700;
    cursor: pointer;
    text-align: left;
    transition: all 0.18s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .adminAccordionBtn:hover {
    border-color: #94a3b8;
    background: #f1f5f9;
  }
  .adminAccordionBtn.activo {
    background: #0f172a;
    border-color: #0f172a;
    color: #fff;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
  }
  .adminToolbar {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 12px;
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
  .adminFormActions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 4px;
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
  .adminListaControles {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px;
  }
  .adminListaControles input,
  .adminListaControles select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #c7c7c7;
    border-radius: 8px;
    background: #fff;
  }
  .adminConteo {
    margin: 0 0 8px;
    color: #475569;
    font-size: 13px;
  }
  .adminToggleTodos {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 2px 0 8px;
    color: #334155;
    font-size: 14px;
  }
  .adminLista h3 {
    margin: 8px 0 10px;
  }
  .adminVacio {
    border: 1px dashed #b6b6b6;
    border-radius: 8px;
    padding: 12px;
    background: #fafafa;
    color: #334155;
  }
  .tablaAdminWrap {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
  }
  @media (max-width: 720px) {
    .adminLayout {
      grid-template-columns: 1fr;
    }
    .adminSidebar {
      position: static;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .adminToolbar {
      grid-template-columns: 1fr;
    }
    .adminListaControles {
      grid-template-columns: 1fr;
    }
    .adminDashGrid {
      grid-template-columns: 1fr;
    }
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
    vertical-align: middle;
  }
  .tablaAdmin th {
    background: #f8fafc;
    color: #374151;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .tablaAdmin tbody tr:nth-child(even) {
    background: #fcfdff;
  }
  .btnEditarAdmin {
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #0f172a;
    border-radius: 8px;
    padding: 7px 12px;
    cursor: pointer;
    font-weight: 600;
    min-width: 88px;
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
    background: #334155 !important;
    border: 1px solid #334155 !important;
    color: #fff !important;
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
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .header.headerElevated {
    border-bottom-color: #cbd5e1;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  }
  .titulo {
    margin: 0;
    font-size: 26px;
    letter-spacing: 0.3px;
    color: #111827;
    font-weight: 800;
  }
  .acciones {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    position: relative;
    width: 100%;
    justify-content: flex-end;
  }
  .btnZonaCuenta { order: 1; }
  .btnZonaFiltros { order: 2; }
  .btnZonaCompra { order: 3; margin-left: 4px; }
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
    border-color: var(--accent-500) !important;
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
  .btnFiltroHeader,
  .btnCategoriasHeader {
    border-color: #cbd5e1 !important;
    background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%) !important;
    color: #0f172a !important;
    font-weight: 700;
    letter-spacing: 0.1px;
    min-width: 112px;
    border-radius: 999px;
    padding: 0 16px;
  }
  .btnFiltroHeader::before {
    content: "▦";
    font-size: 14px;
    line-height: 1;
    opacity: 0.85;
    margin-right: 2px;
  }
  .btnCategoriasHeader::before {
    content: "☰";
    font-size: 13px;
    line-height: 1;
    opacity: 0.85;
    margin-right: 2px;
  }
  .btnFiltroHeader.activo,
  .btnCategoriasHeader.activo {
    border-color: var(--accent-600) !important;
    background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%) !important;
    color: #ffffff !important;
    box-shadow: 0 10px 20px rgba(2, 132, 199, 0.28);
  }
  .btnFiltroHeader {
    margin-right: 0;
  }
  .btnCategoriasHeader {
    margin-left: 0;
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
  .topBar {
    background: linear-gradient(90deg, var(--brand-900), var(--brand-700));
    color: #f1f5f9;
    padding: 8px 20px;
    display: flex;
    gap: 18px;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    border-bottom: 1px solid #1f2937;
  }
  .heroVentas {
    margin: 14px 20px 8px;
    background: linear-gradient(120deg, var(--brand-900) 0%, var(--brand-700) 50%, var(--accent-600) 100%);
    color: #fff;
    border-radius: 16px;
    padding: 20px 22px;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 16px;
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.2);
  }
  .heroTag {
    margin: 0 0 8px;
    font-size: 12px;
    letter-spacing: 0.8px;
    font-weight: 800;
    opacity: 0.95;
    color: #e2e8f0;
  }
  .heroTexto h2 {
    margin: 0 0 8px;
    font-size: 28px;
    line-height: 1.15;
    letter-spacing: 0.2px;
  }
  .heroTexto p {
    margin: 0;
    opacity: 0.95;
    line-height: 1.5;
  }
  .heroAcciones {
    margin-top: 14px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .btnHeroPrimario,
  .btnHeroSecundario {
    border: 0;
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .btnHeroPrimario {
    background: #fff;
    color: #0f172a;
  }
  .btnHeroSecundario {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.28);
  }
  .heroStats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    align-items: stretch;
  }
  .heroStats div {
    background: rgba(240, 249, 255, 0.13);
    border: 1px solid rgba(240, 249, 255, 0.28);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .heroStats strong {
    font-size: 20px;
    line-height: 1;
  }
  .heroStats small {
    margin-top: 4px;
    font-size: 12px;
    opacity: 0.9;
  }
  .miniResumen {
    margin: 8px 20px 4px;
    background: #fff;
    border: 1px solid var(--border-soft);
    border-radius: 12px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
  }
  .miniResumen button {
    border: 1px solid var(--brand-900);
    background: var(--brand-900);
    color: #fff;
    border-radius: 8px;
    padding: 8px 10px;
    font-weight: 700;
    cursor: pointer;
  }
  .badgesProducto {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
  }
  .badgeProducto {
    background: linear-gradient(135deg, var(--accent-500), var(--accent-600));
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    border-radius: 999px;
    padding: 4px 8px;
  }
  .bloqueRecomendados {
    margin-top: 16px;
    background: #fff;
    border: 1px solid #dbe3ef;
    border-radius: 14px;
    padding: 14px;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  }
  .bloqueRecomendados h3 {
    margin: 0 0 10px;
  }
  .chipsRecomendados {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chipsRecomendados button {
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #0f172a;
    border-radius: 999px;
    padding: 7px 10px;
    font-size: 13px;
    cursor: pointer;
  }
  .chipsRecomendados button:hover {
    border-color: var(--accent-500);
    color: var(--accent-600);
    background: var(--accent-50);
  }
  @media (max-width: 900px) {
    .topBar {
      flex-direction: column;
      align-items: center;
      gap: 4px;
      text-align: center;
    }
    .header {
      align-items: flex-start;
      flex-direction: column;
    }
    .presentacionCentro h1 {
      font-size: 32px;
    }
    .btnEsquina {
      top: 12px;
      padding: 8px 10px;
      font-size: 13px;
    }
    .btnEsquinaIzq { left: 12px; }
    .btnEsquinaDer { right: 12px; }
    .acciones {
      width: 100%;
      justify-content: flex-start;
    }
    .btnZonaCuenta,
    .btnZonaFiltros,
    .btnZonaCompra {
      order: initial;
      margin-left: 0;
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
    .layout {
      grid-template-columns: 1fr;
      padding: 10px 12px 18px;
    }
    .menu {
      position: static;
    }
    .listaCategorias {
      grid-template-columns: 1fr;
    }
    .filaFiltro {
      grid-template-columns: 1fr;
    }
    .productosSkeleton {
      grid-template-columns: 1fr;
    }
    .adminStatsGrid {
      grid-template-columns: 1fr;
    }
    .comparacionGrid {
      grid-template-columns: 1fr;
    }
    .footerGrid {
      grid-template-columns: 1fr;
    }
    .buscador {
      margin: 10px 12px 6px;
    }
    .cardInicio {
      padding: 30px 24px;
      width: 92vw;
    }
    .heroVentas {
      grid-template-columns: 1fr;
      margin: 10px 12px 6px;
      padding: 16px;
    }
    .heroTexto h2 {
      font-size: 22px;
    }
    .miniResumen {
      margin: 8px 12px 4px;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .panelNotificaciones {
    margin: 10px 20px;
    background: #fff;
    border: 1px solid #d8e0ea;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
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
  .btnBackAuth {
    align-self: flex-start;
    width: auto !important;
    padding: 8px 10px !important;
    border-radius: 8px !important;
    border: 1px solid #d1d5db !important;
    background: #f8fafc !important;
    color: #0f172a !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    margin-bottom: -6px;
  }
  .btnBackAuth:hover {
    border-color: var(--accent-500) !important;
    background: var(--accent-50) !important;
    color: var(--accent-600) !important;
  }

  .cardAuth button {
    background: #0f172a;
    border-radius: 10px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    width: 100%;
    padding: 12px;
    transition: all 0.2s ease;
  }

  .cardAuth button:hover {
    transform: translateY(-1px);
    background: #1e293b;
    color: #fff;

  }
  input {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;
    background: #fff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  input:focus,
  textarea:focus,
  select:focus {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.16);
  }
  input[type="radio"] {
    width: auto;
    padding: 0;
    border: 0;
    accent-color: #0f172a;
  }

  .link {
    color: #0f62fe;
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
    background: #fff;
    border: 1px solid #dbe3ef;
    border-radius: 16px;
    padding: 16px 14px;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
    animation: fadeUp 0.35s ease both;
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
    border: 1px solid var(--border-soft);
    border-radius: 14px;
    padding: 16px;
    text-align: center;
    position: relative;
    background: #fff;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.09);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: fadeUp 0.3s ease both;
  }
  .productos .card:nth-child(2) { animation-delay: 0.03s; }
  .productos .card:nth-child(3) { animation-delay: 0.06s; }
  .productos .card:nth-child(4) { animation-delay: 0.09s; }
  .productos .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 32px rgba(2, 132, 199, 0.15);
    border-color: #b6d7ef;
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
    background: #d50000;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .productos .card .precio {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
  }
  .agregar {
    background: var(--brand-900) !important;
    border: 1px solid var(--brand-900) !important;
    color: #fff !important;
    border-radius: 10px !important;
  }
  .agregar:hover {
    background: var(--brand-700) !important;
  }

  .buscador {
    margin: 14px 20px 8px;
  }
  .buscador input {
    width: 100%;
    max-width: 560px;
    background: #fff;
    border: 1px solid #d6deea;
    border-radius: 999px;
    padding: 12px 16px;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  }
  .layout {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 18px;
    padding: 12px 20px 24px;
  }
  .menu {
    background: #fff;
    border: 1px solid #dbe3ef;
    border-radius: 14px;
    padding: 14px;
    height: fit-content;
    position: sticky;
    top: 86px;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  }
  .filtrosPanel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #dbe3ef;
  }
  .filaFiltro {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .filtrosPanel input,
  .filtrosPanel select {
    width: 100%;
    border: 1px solid #dbe3ef;
    border-radius: 8px;
    padding: 8px 10px;
    background: #fff;
  }
  .checkFiltro {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-muted);
  }
  .btnLimpiarFiltros {
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: var(--brand-700);
    border-radius: 8px;
    padding: 8px 10px;
    font-weight: 600;
    cursor: pointer;
  }
  .btnLimpiarFiltros:hover {
    background: var(--accent-50);
    border-color: var(--accent-500);
    color: var(--accent-600);
  }
  .checkoutWrap {
    padding: 8px 0 0;
  }
  .checkoutStepper {
    position: relative;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 0 auto 10px;
    max-width: 860px;
    padding: 8px 10px 0;
  }
  .step {
    border: 1px solid #dbe3ef;
    background: #f8fafc;
    color: var(--text-muted);
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 700;
    z-index: 1;
  }
  .step.done {
    border-color: #86efac;
    background: #f0fdf4;
    color: #166534;
  }
  .step.activo {
    border-color: #0f172a;
    background: #0f172a;
    color: #fff;
  }
  .checkoutProgress {
    position: absolute;
    left: 10px;
    right: 10px;
    height: 6px;
    top: 0;
    border-radius: 999px;
    background: #e2e8f0;
    overflow: hidden;
  }
  .checkoutProgress::after {
    content: "";
    display: block;
    height: 100%;
    width: var(--progress, 0%);
    background: linear-gradient(90deg, #0ea5e9, #0f172a);
    border-radius: inherit;
    transition: width 0.35s ease;
  }
  .productosSkeleton {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
  }
  .cardSkeleton {
    height: 260px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
    background-size: 400% 100%;
    animation: loadingShimmer 1.2s ease-in-out infinite;
  }
  .emptyProductos {
    width: 100%;
    border: 1px dashed #cbd5e1;
    background: #f8fafc;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    color: var(--text-muted);
  }
  @keyframes loadingShimmer {
    0% { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .listaCategorias {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .categoria {
    width: 100%;
    text-align: center;
    border: 1px solid #dbe3ef;
    background: #f8fafc;
    color: #1e293b;
    border-radius: 10px;
    padding: 9px 10px;
    cursor: pointer;
    font-weight: 600;
  }
  .listaCategorias .categoria:first-child {
    grid-column: 1 / -1;
  }
  .categoria:hover {
    border-color: var(--accent-500);
    color: var(--accent-600);
    background: var(--accent-50);
  }
  .contenido {
    min-width: 0;
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
  .adminStatsGrid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 10px;
  }
  .adminStatCard {
    border: 1px solid var(--border-soft);
    background: var(--surface);
    border-radius: 12px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .adminStatCard small {
    color: #475569;
  }
  .adminStatCard strong {
    color: var(--brand-900);
    font-size: 20px;
  }
  .adminNavIcon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
  }
  .adminTopStockGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    max-width: 540px;
  }
  .adminTopStockGrid button {
    text-align: left;
    border: 1px solid #d1d9e6;
    background: #f8fafc;
    color: #0f172a;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .adminDashGrid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 12px;
  }
  .adminAlertList {
    display: grid;
    gap: 8px;
  }
  .adminAlertItem {
    border: 1px solid #e2e8f0;
    border-left: 4px solid #be123c;
    border-radius: 10px;
    padding: 9px 10px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }
  .adminAlertItem strong {
    color: #0f172a;
    font-size: 13px;
  }
  .adminAlertItem span {
    color: #64748b;
    font-size: 12px;
  }
  .tablaCompacta td, .tablaCompacta th {
    font-size: 13px;
    padding: 9px 10px;
  }
  .estadoBadge {
    display: inline-block;
    border: 1px solid #cbd5e1;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    background: #f8fafc;
    text-transform: capitalize;
  }
  .adminChartCard {
    margin-top: 14px;
  }
  .adminSkeletonGrid {
    display: grid;
    gap: 8px;
    margin: 6px 0 10px;
  }
  .adminSkeletonLine,
  .adminSkeletonCard {
    border-radius: 10px;
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 37%, #e2e8f0 63%);
    background-size: 400% 100%;
    animation: shimmer 1.2s ease infinite;
  }
  .adminSkeletonLine {
    height: 38px;
  }
  .adminSkeletonCard {
    height: 78px;
  }
  .adminPaginator {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }
  .adminPaginator span {
    color: #475569;
    font-size: 13px;
    font-weight: 700;
  }
  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }
  :global(.nv-notification) {
    border-radius: 12px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.22);
    border: 1px solid rgba(203, 213, 225, 0.75);
    backdrop-filter: blur(4px);
  }
  :global(.nv-notification-title) {
    font-family: 'Sora', 'Manrope', sans-serif;
  }
  .accionesCard {
    margin-top: 8px;
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .btnMini {
    border: 1px solid var(--border-soft);
    background: #f8fafc;
    border-radius: 8px;
    padding: 6px 10px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .btnMini:hover {
    border-color: var(--accent-500);
    background: var(--accent-50);
    color: var(--accent-600);
  }
  .comparacionGrid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .itemComparacion {
    border: 1px solid var(--border-soft);
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    background: #fff;
  }
  .itemComparacion img {
    width: 100%;
    height: 120px;
    object-fit: contain;
  }
  .footerSite {
    margin-top: 24px;
    background: linear-gradient(135deg, var(--brand-900), var(--brand-700));
    color: #e2e8f0;
    border-top: 1px solid rgba(148, 163, 184, 0.25);
    padding: 20px;
  }
  .footerGrid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 12px;
  }
  .footerGrid h4 {
    margin: 0 0 6px;
    color: #f8fafc;
    font-size: 15px;
  }
  .footerGrid p {
    margin: 4px 0;
    color: #cbd5e1;
    font-size: 13px;
  }
  .footerSite small {
    display: block;
    color: #94a3b8;
    font-size: 12px;
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
import { Boxes, LayoutDashboard, Lock, Mail, Phone, ShieldCheck, User, Users } from '@lucide/vue'
import { Notification, Notivue, push } from 'notivue'
import { defineAsyncComponent } from 'vue'
import { supabase } from '@/supabase'
import { actualizarProductoAdmin, bootstrapProductosAdmin, crearProductoAdmin, eliminarProductoAdmin, obtenerProductos, refrescarImagenesProductosAdmin, subirImagenProductoStorage } from '@/services/productosService'
import { agregarItem, actualizarItem, eliminarItem, vaciarCarrito, obtenerCarrito } from '@/services/carritoService'
import { obtenerMetodosPago, procesarPago } from '@/services/pagosService'
import { obtenerNotificaciones, marcarNotificacionLeida } from '@/services/notificacionesService'
import { estimarEntrega } from '@/services/entregaService'
import { obtenerPedidos } from '@/services/pedidosService'
import { obtenerResenasProducto, obtenerEstadoMiResena, guardarResena } from '@/services/resenasService'

export default {
  components: {
    CarritoView,
    DireccionView,
    LayoutDashboard,
    Boxes,
    Users,
    Mail,
    Lock,
    User,
    Phone,
    ShieldCheck,
    apexchart: defineAsyncComponent(() => import('vue3-apexcharts')),
    Notivue,
    Notification,
  },

  data() {
    return {
      vista: 'inicio',
      correo: '',
      password: '',
      confirmPassword: '',
      nombreRegistro: '',
      telefonoRegistro: '',
      mensaje: '',
      mensajeColor: 'red',
      mostrarMensaje: false,
      comparacionAbierta: false,
      introCardRX: 0,
      introCardRY: 0,
      introCardLX: 50,
      introCardLY: 50,
      productos: [],          // ← ya no hardcodeado
      cargando: false,
      headerElevated: false,
      errorCarga: null,
      carrito: [],
      carritoCacheUserId: '',
      buscar: '',
      filtroPrecioMin: null,
      filtroPrecioMax: null,
      filtroNombre: '',
      filtroCategoria: '',
      soloDisponibles: false,
      ordenProductos: 'default',
      i: 0,
      showM: true,
      panelLateralActivo: 'categorias',
      cat: '',
      categoriasBase: ['Frenos', 'Motor', 'Suspensión', 'Electricidad', 'Llantas', 'Lubricantes', 'Repuestos'],
      detalle: null,
      menuUser: false,
      isAdmin: false,
      favoritosIds: [],
      comparacionIds: [],
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
      ejecutandoRefreshImagenes: false,
      subiendoImagenAdmin: false,
      editandoProductoId: null,
      adminSeccionActiva: 'dashboard',
      adminSidebarCollapsed: false,
      buscarProductoAdmin: '',
      filtroCategoriaAdmin: '',
      ordenProductoAdmin: 'nombre_asc',
      mostrarTodosProductosAdmin: false,
      adminProductosPagina: 1,
      adminUsuariosPagina: 1,
      adminItemsPorPagina: 8,
      usuariosAdmin: [],
      cargandoUsuariosAdmin: false,
      buscarUsuarioAdmin: '',
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
    window.addEventListener('scroll', this.handleHeaderScroll, { passive: true })
    window.addEventListener('popstate', this.syncVistaAuthDesdeRuta)
    this.handleHeaderScroll()
    this.syncVistaAuthDesdeRuta()
    const [_, sessionResp] = await Promise.all([
      this.cargarProductos(),
      supabase.auth.getSession(),
    ])
    const { data } = sessionResp
    if (data.session) {
      this.definirRolDesdeSesion(data.session)
      this.carritoCacheUserId = data.session.user.id
      this.cargarCarritoLocal()
      this.cargarFavoritosLocal()
      this.vista = 'app'
      await Promise.all([
        this.cargarCarritoBackend(),
        this.cargarMetodosPago(),
        this.cargarNotificaciones(),
        this.cargarPedidos(),
      ])
      this.iniciarPollingNotificaciones()
    }
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.handleHeaderScroll)
    window.removeEventListener('popstate', this.syncVistaAuthDesdeRuta)
    this.detenerPollingNotificaciones()
  },

  computed: {
    filtrados() {
      const filtradosBase = this.productos.filter(p =>
        p.nombre.toLowerCase().includes(this.buscar.toLowerCase()) &&
        (!this.filtroNombre || p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())) &&
        (!this.filtroCategoria || p.categoria === this.filtroCategoria) &&
        (!this.cat || p.categoria === this.cat) &&
        (this.filtroPrecioMin === null || this.filtroPrecioMin === '' || Number(p.precio) >= Number(this.filtroPrecioMin)) &&
        (this.filtroPrecioMax === null || this.filtroPrecioMax === '' || Number(p.precio) <= Number(this.filtroPrecioMax)) &&
        (!this.soloDisponibles || Number(p.stock || 0) > 0)
      )

      const sorted = [...filtradosBase]
      if (this.ordenProductos === 'price_asc') sorted.sort((a, b) => Number(a.precio) - Number(b.precio))
      if (this.ordenProductos === 'price_desc') sorted.sort((a, b) => Number(b.precio) - Number(a.precio))
      if (this.ordenProductos === 'name_asc') sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      if (this.ordenProductos === 'name_desc') sorted.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'))
      return sorted
    },
    categoriasDisponibles() {
      const ordenBase = ['Frenos', 'Motor', 'Suspensión', 'Electricidad', 'Llantas', 'Lubricantes', 'Repuestos']
      const setCategorias = new Set([
        ...ordenBase,
        ...this.categoriasBase,
        ...this.productos.map((p) => p.categoria),
      ].filter(Boolean))

      const enOrden = ordenBase.filter((c) => setCategorias.has(c))
      const extras = Array.from(setCategorias)
        .filter((c) => !ordenBase.includes(c))
        .sort((a, b) => a.localeCompare(b, 'es'))

      return ['', ...enOrden, ...extras]
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
    },
    masVendidos() {
      return [...this.productos]
        .sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))
        .slice(0, 6)
    },
    productosStockBajo() {
      return [...this.productos]
        .filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 5)
        .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
        .slice(0, 6)
    },
    pedidosRecientes() {
      return [...this.pedidos]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6)
    },
    productosComparacion() {
      return this.productos.filter((p) => this.comparacionIds.includes(p.id))
    },
    adminMetricas() {
      return {
        totalProductos: this.productos.length,
        stockBajo: this.productos.filter((p) => Number(p.stock || 0) <= 5).length,
        totalPedidos: this.pedidos.length,
        ventasEstimadas: this.pedidos.reduce((acc, p) => acc + Number(p.total_amount || 0), 0),
      }
    },
    stockPorCategoria() {
      const resumen = this.productos.reduce((acc, p) => {
        const categoria = p.categoria || 'Sin categoría'
        acc[categoria] = (acc[categoria] || 0) + Number(p.stock || 0)
        return acc
      }, {})
      return Object.entries(resumen)
        .map(([categoria, stock]) => ({ categoria, stock }))
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 8)
    },
    dashboardStockSeries() {
      return [{
        name: 'Stock',
        data: this.stockPorCategoria.map((item) => item.stock),
      }]
    },
    dashboardStockOptions() {
      return {
        chart: {
          toolbar: { show: false },
          foreColor: '#334155',
        },
        plotOptions: {
          bar: { borderRadius: 6, columnWidth: '46%' },
        },
        xaxis: {
          categories: this.stockPorCategoria.map((item) => item.categoria),
          labels: { rotate: -20 },
        },
        yaxis: {
          labels: {
            formatter: (val) => Number(val).toLocaleString('es-CO'),
          },
        },
        dataLabels: { enabled: false },
        colors: ['#0f172a'],
        grid: { borderColor: '#e2e8f0' },
        tooltip: {
          y: {
            formatter: (val) => `${Number(val).toLocaleString('es-CO')} unidades`,
          },
        },
      }
    },
    usuariosAdminFiltrados() {
      const q = (this.buscarUsuarioAdmin || '').toLowerCase().trim()
      if (!q) return this.usuariosAdmin
      return this.usuariosAdmin.filter((u) =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      )
    },
    productosAdminFiltrados() {
      const q = (this.buscarProductoAdmin || '').toLowerCase().trim()
      const hayFiltroCategoria = !!this.filtroCategoriaAdmin
      const hayOrdenPersonalizado = this.ordenProductoAdmin !== 'nombre_asc'
      const mostrarResultados = this.mostrarTodosProductosAdmin || !!q || hayFiltroCategoria || hayOrdenPersonalizado
      if (!mostrarResultados) return []

      let lista = this.productos.filter((p) => {
        const matchTexto = !q || (p.nombre || '').toLowerCase().includes(q) || (p.marca || '').toLowerCase().includes(q)
        const matchCategoria = !this.filtroCategoriaAdmin || p.categoria === this.filtroCategoriaAdmin
        return matchTexto && matchCategoria
      })

      lista = [...lista]
      if (this.ordenProductoAdmin === 'nombre_asc') lista.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es'))
      if (this.ordenProductoAdmin === 'nombre_desc') lista.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || '', 'es'))
      if (this.ordenProductoAdmin === 'precio_asc') lista.sort((a, b) => Number(a.precio || 0) - Number(b.precio || 0))
      if (this.ordenProductoAdmin === 'precio_desc') lista.sort((a, b) => Number(b.precio || 0) - Number(a.precio || 0))
      return lista
    },
    productosAdminTotalPaginas() {
      return Math.max(1, Math.ceil(this.productosAdminFiltrados.length / this.adminItemsPorPagina))
    },
    productosAdminPaginados() {
      const inicio = (this.adminProductosPagina - 1) * this.adminItemsPorPagina
      return this.productosAdminFiltrados.slice(inicio, inicio + this.adminItemsPorPagina)
    },
    usuariosAdminTotalPaginas() {
      return Math.max(1, Math.ceil(this.usuariosAdminFiltrados.length / this.adminItemsPorPagina))
    },
    usuariosAdminPaginados() {
      const inicio = (this.adminUsuariosPagina - 1) * this.adminItemsPorPagina
      return this.usuariosAdminFiltrados.slice(inicio, inicio + this.adminItemsPorPagina)
    }
  },

  watch: {
    vista(newVista) {
      this.syncRutaDesdeVista(newVista)
    },
    buscarProductoAdmin() {
      this.adminProductosPagina = 1
    },
    filtroCategoriaAdmin() {
      this.adminProductosPagina = 1
    },
    ordenProductoAdmin() {
      this.adminProductosPagina = 1
    },
    mostrarTodosProductosAdmin() {
      this.adminProductosPagina = 1
    },
    buscarUsuarioAdmin() {
      this.adminUsuariosPagina = 1
    },
    adminSeccionActiva() {
      this.adminProductosPagina = 1
      this.adminUsuariosPagina = 1
    },
    productosAdminTotalPaginas(newVal) {
      if (this.adminProductosPagina > newVal) this.adminProductosPagina = newVal
    },
    usuariosAdminTotalPaginas(newVal) {
      if (this.adminUsuariosPagina > newVal) this.adminUsuariosPagina = newVal
    },
  },

  methods: {
    rutaParaVista(vista) {
      const map = {
        inicio: '/',
        login: '/login',
        registro: '/registro',
        app: '/tienda',
        carrito: '/carrito',
        direccion: '/direccion',
        pago: '/pago',
        pedidos: '/pedidos',
        adminProductos: '/admin/productos',
        adminDashboard: '/admin/dashboard',
        adminUsuarios: '/admin/usuarios',
      }
      return map[vista] || '/'
    },
    vistaParaRuta(pathname = '/') {
      const map = {
        '/': 'inicio',
        '/login': 'login',
        '/registro': 'registro',
        '/tienda': 'app',
        '/carrito': 'carrito',
        '/direccion': 'direccion',
        '/pago': 'pago',
        '/pedidos': 'pedidos',
        '/admin/productos': 'adminProductos',
        '/admin/dashboard': 'adminDashboard',
        '/admin/usuarios': 'adminUsuarios',
      }
      return map[pathname] || 'inicio'
    },
    syncRutaDesdeVista(vista) {
      const ruta = this.rutaParaVista(vista)
      if (window.location.pathname !== ruta) {
        window.history.pushState({}, '', ruta)
      }
    },
    irAVista(vistaObjetivo) {
      this.vista = vistaObjetivo
    },
    irARutaAuth(vistaObjetivo) {
      const ruta = vistaObjetivo === 'login' ? '/login' : vistaObjetivo === 'registro' ? '/registro' : '/'
      this.vista = vistaObjetivo
      if (window.location.pathname !== ruta) {
        window.history.pushState({}, '', ruta)
      }
    },
    syncVistaAuthDesdeRuta() {
      const path = window.location.pathname.toLowerCase()
      const vistaRuta = this.vistaParaRuta(path)
      if (vistaRuta === 'adminDashboard') {
        this.vista = 'adminProductos'
        this.adminSeccionActiva = 'dashboard'
        return
      }
      if (vistaRuta === 'adminUsuarios') {
        this.vista = 'adminProductos'
        this.adminSeccionActiva = 'usuarios'
        return
      }
      this.vista = vistaRuta
    },
    moverCardInicio(event) {
      const rect = event.currentTarget?.getBoundingClientRect?.()
      if (!rect) return
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      this.introCardRY = (x - 0.5) * 10
      this.introCardRX = (0.5 - y) * 8
      this.introCardLX = Math.round(x * 100)
      this.introCardLY = Math.round(y * 100)
    },
    resetCardInicio() {
      this.introCardRX = 0
      this.introCardRY = 0
      this.introCardLX = 50
      this.introCardLY = 50
    },
    estiloCardInicioInteractiva() {
      return {
        transform: `perspective(900px) rotateX(${this.introCardRX}deg) rotateY(${this.introCardRY}deg)`,
        boxShadow: `0 30px 55px rgba(2, 6, 23, 0.45), 0 0 0 1px rgba(255,255,255,0.16)`,
        background: `radial-gradient(circle at ${this.introCardLX}% ${this.introCardLY}%, rgba(255,255,255,0.94), rgba(255,255,255,0.88) 36%, rgba(248,250,252,0.82) 100%)`,
        '--lx': `${this.introCardLX}%`,
        '--ly': `${this.introCardLY}%`,
      }
    },
    estiloBotonInicio(sign = 1) {
      const dx = this.introCardRY * 0.35 * sign
      const dy = this.introCardRX * -0.35 * sign
      return {
        transform: `translate(${dx}px, ${dy}px)`,
      }
    },
    abrirDashboardAdmin() {
      this.menuUser = false
      this.vista = 'adminProductos'
      this.adminSeccionActiva = 'dashboard'
    },
    async abrirUsuariosAdmin() {
      this.menuUser = false
      this.vista = 'adminProductos'
      this.adminSeccionActiva = 'usuarios'
      if (!this.usuariosAdmin.length) {
        await this.cargarUsuariosAdmin()
      }
    },
    favoritosStorageKey() {
      const base = this.carritoCacheUserId || 'guest'
      return `serviteka_favs_${base}`
    },
    cargarFavoritosLocal() {
      try {
        const raw = localStorage.getItem(this.favoritosStorageKey())
        this.favoritosIds = raw ? JSON.parse(raw) : []
      } catch {
        this.favoritosIds = []
      }
    },
    guardarFavoritosLocal() {
      localStorage.setItem(this.favoritosStorageKey(), JSON.stringify(this.favoritosIds))
    },
    esFavorito(productId) {
      return this.favoritosIds.includes(productId)
    },
    toggleFavorito(producto) {
      if (!producto?.id) return
      if (this.esFavorito(producto.id)) {
        this.favoritosIds = this.favoritosIds.filter((id) => id !== producto.id)
      } else {
        this.favoritosIds = [...this.favoritosIds, producto.id]
      }
      this.guardarFavoritosLocal()
    },
    abrirFavoritos() {
      const ids = new Set(this.favoritosIds)
      this.cat = ''
      this.filtroNombre = ''
      this.buscar = ''
      this.filtroCategoria = ''
      this.showM = true
      this.panelLateralActivo = 'filtros'
      this.productos = [...this.productos].sort((a, b) => (ids.has(b.id) ? 1 : 0) - (ids.has(a.id) ? 1 : 0))
      this.mostrar('Favoritos resaltados arriba', 'green')
    },
    enComparacion(productId) {
      return this.comparacionIds.includes(productId)
    },
    toggleComparacion(producto) {
      if (!producto?.id) return
      if (this.enComparacion(producto.id)) {
        this.comparacionIds = this.comparacionIds.filter((id) => id !== producto.id)
        return
      }
      if (this.comparacionIds.length >= 3) {
        this.mostrar('Solo puedes comparar hasta 3 productos', 'red')
        return
      }
      this.comparacionIds = [...this.comparacionIds, producto.id]
    },
    abrirComparacion() {
      if (this.comparacionIds.length < 2) {
        this.mostrar('Selecciona al menos 2 productos para comparar', 'red')
        return
      }
      this.comparacionAbierta = true
    },
    iconoMetodoPago(id) {
      if (id === 'card') return 'https://img.icons8.com/color/96/bank-card-back-side.png'
      if (id === 'pse') return 'https://img.icons8.com/color/96/bank-building.png'
      return 'https://img.icons8.com/color/96/cash-in-hand.png'
    },
    handleHeaderScroll() {
      this.headerElevated = window.scrollY > 12
    },
    badgesProducto(p) {
      if (!p) return []
      const badges = []
      if (Number(p.stock || 0) <= 3) badges.push('Últimas unidades')
      if (Number(p.precio || 0) >= 300000) badges.push('Premium')
      if (Number(p.stock || 0) > 20) badges.push('Nuevo')
      return badges.slice(0, 2)
    },
    formatPrecio(value) {
      const amount = Number(value || 0)
      return `$ ${amount.toLocaleString('es-CO')}`
    },
    irAComprarDesdeHero() {
      this.cat = ''
      this.$nextTick(() => {
        const el = this.$refs.seccionCatalogo
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },
    verCategoriasDesdeHero() {
      this.showM = true
      this.panelLateralActivo = 'categorias'
      this.$nextTick(() => {
        const el = this.$refs.panelCategorias
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },
    toggleFiltros() {
      this.panelLateralActivo = 'filtros'
      this.showM = true
      this.$nextTick(() => {
        const el = this.$refs.panelCategorias
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },
    toggleCategorias() {
      this.panelLateralActivo = 'categorias'
      this.showM = true
      this.$nextTick(() => {
        const el = this.$refs.panelCategorias
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },
    limpiarFiltros() {
      this.filtroPrecioMin = null
      this.filtroPrecioMax = null
      this.filtroNombre = ''
      this.filtroCategoria = ''
      this.soloDisponibles = false
      this.ordenProductos = 'default'
      this.cat = ''
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
      this.adminSeccionActiva = 'dashboard'
    },
    async toggleSeccionAdmin(seccion) {
      this.adminSeccionActiva = seccion
      if (seccion === 'usuarios' && !this.usuariosAdmin.length) {
        await this.cargarUsuariosAdmin()
      }
    },
    async cargarUsuariosAdmin() {
      if (!this.isAdmin) return
      this.cargandoUsuariosAdmin = true
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, name, email, created_at')
          .order('created_at', { ascending: false })
        if (error) throw error
        this.usuariosAdmin = data || []
      } catch (err) {
        this.mostrar(err.message || 'No se pudieron cargar los usuarios', 'red')
      } finally {
        this.cargandoUsuariosAdmin = false
      }
    },
    async eliminarUsuarioAdmin(usuario) {
      if (!this.isAdmin || !usuario?.id) return
      const ok = window.confirm(`¿Eliminar al usuario "${usuario.email || usuario.name}"?`)
      if (!ok) return
      try {
        const { error } = await supabase
          .from('usuarios')
          .delete()
          .eq('id', usuario.id)
        if (error) throw error
        this.usuariosAdmin = this.usuariosAdmin.filter((u) => u.id !== usuario.id)
        this.mostrar('Usuario eliminado correctamente', 'green')
      } catch (err) {
        this.mostrar(err.message || 'No se pudo eliminar el usuario', 'red')
      }
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
    async ejecutarRefreshImagenesProductos() {
      if (!this.isAdmin) return
      this.ejecutandoRefreshImagenes = true
      try {
        const result = await refrescarImagenesProductosAdmin()
        await this.cargarProductos()
        this.mostrar(`Imágenes actualizadas: ${result.updatedImages || 0}`, 'green')
      } catch (err) {
        this.mostrar(err.message || 'No se pudieron refrescar las imágenes', 'red')
      } finally {
        this.ejecutandoRefreshImagenes = false
      }
    },
    async subirImagenProductoDesdeArchivo(event) {
      const file = event?.target?.files?.[0]
      if (!file) return
      this.subiendoImagenAdmin = true
      try {
        const url = await subirImagenProductoStorage(file)
        if (!url) throw new Error('No se obtuvo URL pública de la imagen')
        this.adminProducto.image_url = url
        this.mostrar('Imagen subida correctamente', 'green')
      } catch (err) {
        this.mostrar(err.message || 'No se pudo subir la imagen', 'red')
      } finally {
        this.subiendoImagenAdmin = false
        if (event?.target) event.target.value = ''
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
      if (color === 'green') push.success(msg)
      else push.error(msg)
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
      if (!p || !Number.isInteger(Number(p.id)) || Number(p.id) <= 0) {
        this.mostrar('Este producto no tiene un ID válido', 'red')
        return
      }
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
      await this.cargarMetodosPago()
      if (!this.metodosPago.length) {
        this.mostrar('No hay métodos de pago disponibles por ahora', 'red')
      }
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
      this.vista = 'app'
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
        this.cargarFavoritosLocal()
        await this.cargarCarritoBackend()
        await this.cargarNotificaciones()
        await this.cargarPedidos()
        this.iniciarPollingNotificaciones()
        this.mostrar('Inicio de sesión exitoso', 'green')
        this.mostrarMensaje = false
        this.vista = 'app'
      } catch (err) {
        this.mostrar(this.traducirError(err.message))
      }
    },

    async registro() {
      try {
        if (!this.nombreRegistro.trim()) {
          this.mostrar('Ingresa tu nombre completo')
          return
        }
        if (!this.telefonoRegistro.trim()) {
          this.mostrar('Ingresa tu teléfono')
          return
        }
        if (this.password !== this.confirmPassword) {
          this.mostrar('Las contraseñas no coinciden')
          return
        }
        const { error } = await supabase.auth.signUp({
          email: this.correo,
          password: this.password,
          options: {
            data: {
              name: this.nombreRegistro.trim(),
              phone: this.telefonoRegistro.trim(),
            },
          },
        })
        if (error) throw error
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert([{
            name: this.nombreRegistro.trim() || this.correo.split('@')[0],
            email: this.correo,
          }])
        if (insertError) throw insertError
        this.mostrar('Usuario creado correctamente', 'green')
        this.confirmPassword = ''
        this.nombreRegistro = ''
        this.telefonoRegistro = ''
        this.mostrarMensaje = false
        this.irARutaAuth('login')
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
      this.favoritosIds = []
      this.comparacionIds = []
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
      if (window.location.pathname !== '/') window.history.replaceState({}, '', '/')
      this.mostrar('Sesión cerrada', 'green')
    }
  }
}
</script>
