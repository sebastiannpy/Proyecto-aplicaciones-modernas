import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Proyecto",
      version: "1.0.0",
      description: "Documentación completa de la API",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            brand: { type: "string" },
            stock: { type: "number" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: { type: "integer" },
            product_id: { type: "integer" },
            quantity: { type: "number" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

export default swaggerJSDoc(options);
