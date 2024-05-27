# Usa la imagen base de Node.js
FROM node:18.17

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Establece una variable de entorno
ENV NEXT_PUBLIC_BACKEND_URL=my_value


# Expone el puerto 3000
EXPOSE 3000

# Ejecuta la aplicación cuando se inicie el contenedor
CMD ["npm", "start"]