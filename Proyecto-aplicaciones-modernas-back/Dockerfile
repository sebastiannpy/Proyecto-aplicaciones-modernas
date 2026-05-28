# Imagen base
FROM node:20

# Carpeta de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Puerto (ajústalo si usas otro)
EXPOSE 3000

# Comando para iniciar
CMD ["node", "index.js"]