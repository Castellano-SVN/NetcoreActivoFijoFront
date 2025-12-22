# 1. Etapa de dependencias y build
FROM node:18-alpine AS builder

# Establece el directorio de trabajo en /app
WORKDIR /app

# Instala las dependencias
ARG NPM_TOKEN
COPY package*.json ./
RUN echo "@castellano-svn:registry=https://npm.pkg.github.com" > ~/.npmrc \
 && echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> ~/.npmrc \
 && npm install --legacy-peer-deps

# Copia el resto de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# 2. Etapa de ejecución (Runtime)
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar node_modules y build desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Expone el puerto 3000
EXPOSE 3000

# Ejecuta la aplicación cuando se inicie el contenedor
CMD ["npm", "start"]