# Stage 1: Compilar la aplicación
FROM node:18-alpine as build

# Establece el directorio de trabajo en /app dentro del contenedor
WORKDIR /app

# Copia los archivos de package.json y package-lock.json directamente ya que Dockerfile está dentro de frontend/
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo
COPY  . .

# Construye la aplicación Angular y genera la salida en /app/dist
# RUN npm run build -- --output-path /app/dist

# # Stage 2: Servir la aplicación con nginx
# FROM nginx:alpine

# # Elimina la configuración predeterminada de NGINX
# RUN rm /etc/nginx/conf.d/default.conf

# # Copia la configuración personalizada y los archivos construidos de la aplicación
# COPY --from=build /app/dist/* /usr/share/nginx/html

# # Copia la configuración de Nginx personalizada en el contenedor
# COPY ../nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Inicia NGINX
# CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "start"]