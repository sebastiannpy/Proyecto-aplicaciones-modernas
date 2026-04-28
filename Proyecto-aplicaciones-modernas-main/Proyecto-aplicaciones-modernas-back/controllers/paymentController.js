import { getCartWithItems } from "../models/cartModel.js";
import { createNotification } from "../models/notificationModel.js";
import { createOrder, updateOrderStatus } from "../models/orderModel.js";

const PAYMENT_METHODS = [
  { id: "card", name: "Tarjeta débito/crédito", description: "Pago seguro con tarjeta", secure: true },
  { id: "pse", name: "PSE", description: "Pago desde tu banco", secure: true },
  { id: "cash_on_delivery", name: "Contraentrega", description: "Pago al recibir el pedido", secure: true },
];

function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function isValidExpiry(expiry) {
  const match = /^(\d{2})\/(\d{2})$/.exec(String(expiry || "").trim());
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);
  return expiryDate >= now;
}

function isValidLuhn(cardNumber) {
  const digits = onlyDigits(cardNumber);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function maskCard(cardNumber) {
  const digits = onlyDigits(cardNumber);
  const last4 = digits.slice(-4);
  return `**** **** **** ${last4}`;
}

function validateByMethod(method, details) {
  if (method === "card") {
    if (!isValidLuhn(details.cardNumber)) return "Número de tarjeta inválido";
    if (!details.holder || String(details.holder).trim().length < 3) return "Nombre del titular inválido";
    if (!isValidExpiry(details.expiry)) return "Fecha de vencimiento inválida";

    const cvv = onlyDigits(details.cvv);
    if (cvv.length < 3 || cvv.length > 4) return "CVV inválido";
    return null;
  }

  if (method === "pse") {
    if (!details.bank || String(details.bank).trim().length < 2) return "Banco inválido";
    const document = onlyDigits(details.document);
    if (document.length < 6) return "Documento inválido";
    return null;
  }

  if (method === "cash_on_delivery") return null;

  return "Método de pago no soportado";
}

export async function getPaymentMethods(req, res) {
  res.json({ methods: PAYMENT_METHODS });
}

export async function processPayment(req, res, next) {
  try {
    const userId = req.user.id;
    const { method, details = {}, delivery = {} } = req.body;

    const cart = await getCartWithItems(userId);
    if (!cart.items?.length) {
      return res.status(400).json({ message: "No puedes pagar con el carrito vacío" });
    }

    const validationError = validateByMethod(method, details);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Simulación controlada de rechazo para pruebas
    if (method === "card" && onlyDigits(details.cardNumber).endsWith("0000")) {
      return res.status(402).json({ message: "Pago rechazado por la entidad financiera" });
    }
    if (method === "pse" && onlyDigits(details.document).endsWith("0000")) {
      return res.status(402).json({ message: "Pago PSE rechazado. Verifica tus datos bancarios" });
    }

    const paymentId = `pay_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const order = await createOrder({
      userId,
      totalAmount: cart.total,
      paymentMethod: method,
      delivery,
      items: cart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.products?.name || null,
        price: item.products?.price || 0,
      })),
    });

    const response = {
      success: true,
      payment: {
        id: paymentId,
        method,
        status: "approved",
        amount: cart.total,
        currency: "COP",
      },
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
      },
    };

    if (method === "card") {
      response.payment.maskedCard = maskCard(details.cardNumber);
    }

    try {
      await createNotification({
        userId,
        type: "purchase_confirmed",
        message: "Compra confirmada",
        metadata: { paymentId, orderNumber: order.order_number, amount: cart.total, method },
      });
    } catch (error) {
      console.error("[notifications] Error al crear notificación de compra:", error.message);
    }

    setTimeout(() => {
      updateOrderStatus(order.id, "enviado").catch((error) => {
        console.error("[orders] Error al actualizar pedido a enviado:", error.message);
      });

      createNotification({
        userId,
        type: "purchase_in_transit",
        message: "Compra en camino",
        metadata: { paymentId, orderNumber: order.order_number },
      }).catch((error) => {
        console.error("[notifications] Error al crear notificación de envío:", error.message);
      });
    }, 10000);

    setTimeout(() => {
      updateOrderStatus(order.id, "entregado").catch((error) => {
        console.error("[orders] Error al actualizar pedido a entregado:", error.message);
      });

      createNotification({
        userId,
        type: "purchase_delivered",
        message: "Compra entregada",
        metadata: { paymentId, orderNumber: order.order_number },
      }).catch((error) => {
        console.error("[notifications] Error al crear notificación de entrega:", error.message);
      });
    }, 20000);

    res.json(response);
  } catch (err) {
    next(err);
  }
}
