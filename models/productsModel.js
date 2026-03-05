// filtrar productos por categoria
// filtrar productos por precio
// filtrar productos por nombre (busqueda parcial)
// ordenar productos por precio (ascendente o descendente)
// ordenar productos por nombre (A-Z o Z-A)


import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "../data/products.json");


async function readProductsFile() {
    try {
        const raw = await fs.readFile(DATA_PATH, "utf8");
        return JSON.parse(raw || "[]");
    } catch (err) {
        if (err.code === "ENOENT") {
            await fs.writeFile(DATA_PATH, "[]", "utf8");
            return [];
        }
        throw err;
    }
}

async function writeProductsFile(products) {
    await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf8");
}

export async function getAllProducts() {
    return await readProductsFile();
}


// crea un nuevo producto con un id y se organizan a medida que se van creando
export async function CreateProduct({ name, price, category }) {
    const products = await readProductsFile();
    const newProduct = {
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price,
        category
    };
    products.push(newProduct);
    await writeProductsFile(products);
    return newProduct;
}

// busqueda por id exacto
export async function findProductById(id) {
    const products = await readProductsFile();
    return products.find(p => p.id === id) || null;
}
