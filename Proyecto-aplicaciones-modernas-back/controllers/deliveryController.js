import { getCartWithItems } from "../models/cartModel.js";

const CITY_BASE_HOURS = {
  bogota: 24,
  medellin: 36,
  cali: 40,
  barranquilla: 48,
  cartagena: 48,
  bucaramanga: 36,
  cucuta: 44,
  pereira: 32,
  manizales: 34,
  ibague: 34,
  pasto: 56,
  villavicencio: 30,
};

function normalizeCity(city = "") {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function hourSurcharge(now = new Date()) {
  const hour = now.getHours();
  if (hour >= 7 && hour <= 9) return 3;
  if (hour >= 17 && hour <= 20) return 4;
  if (hour >= 21 || hour <= 5) return 2;
  return 1;
}

export async function estimateDelivery(req, res, next) {
  try {
    const { ciudad, direccion } = req.body;
    const cityKey = normalizeCity(ciudad);
    const base = CITY_BASE_HOURS[cityKey];

    if (!base) {
      return res.status(200).json({
        calculable: false,
        message: "No fue posible calcular el tiempo estimado de entrega para esta ciudad.",
        updatedAt: new Date().toISOString(),
      });
    }

    const cart = await getCartWithItems(req.user.id);
    const itemsCount = Array.isArray(cart.items) ? cart.items.reduce((acc, item) => acc + Number(item.quantity || 0), 0) : 0;
    const itemSurcharge = itemsCount >= 8 ? 6 : itemsCount >= 4 ? 3 : 1;
    const congestionSurcharge = hourSurcharge();

    const estimatedHours = base + itemSurcharge + congestionSurcharge;
    const estimatedDate = new Date(Date.now() + estimatedHours * 60 * 60 * 1000).toISOString();

    res.json({
      calculable: true,
      ciudad,
      direccion,
      estimatedHours,
      estimatedDate,
      message: `Entrega estimada en ${estimatedHours} horas`,
      factors: {
        baseHours: base,
        itemsCount,
        itemSurcharge,
        congestionSurcharge,
      },
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}
