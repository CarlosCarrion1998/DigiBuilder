# Etapa 1: Construir la aplicación usando Maven
FROM maven:3.8.4-openjdk-17-slim AS build

# Instalar Node.js 16.x
# RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
#     RUN apt-get update && apt-get install -y nodejs






# Limpia el caché de apt para reducir el tamaño de la imagen
# RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia el pom.xml y los archivos de la aplicación
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app

# COPY package.json ./usr/src/app

# Define el directorio de trabajo para que cualquier comando subsiguiente se ejecute en este directorio
WORKDIR /usr/src/app

# RUN npm install -g npm@8.19.4

# # RUN npm install
# RUN npm install

# RUN npx -y playwright@1.44.1 install --with-deps

# Compila la aplicación, omite las pruebas unitarias para una construcción más rápida
RUN mvn clean install -DskipTests

FROM node:20-bookworm

RUN npx -y playwright@1.44.1 install --with-deps

# Etapa 2: Crear la imagen que ejecutará la aplicación
FROM openjdk:17-jdk-alpine

# Argumento de puerto para ser consistente y flexible
ARG JAR_FILE=/usr/src/app/target/*.jar

# Copia el JAR file desde la etapa de construcción a esta etapa de ejecución
COPY --from=build ${JAR_FILE} app.jar



# Expone el puerto que la aplicación usará
EXPOSE 8080

# Ejecuta la aplicación Java
ENTRYPOINT ["java","-jar","/app.jar"]
