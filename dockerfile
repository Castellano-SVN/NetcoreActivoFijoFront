# 1. Etapa de dependencias y build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la app
COPY . .

# Construir Next.js
RUN npm run build



# 2. Etapa de ejecución (Runtime)
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar node_modules y build desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Puerto de Next.js
EXPOSE 3000

# Ejecutar la app
CMD ["npm", "start"]
