# Stage 1: Build avec Maven
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copier pom.xml et télécharger les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Compiler et créer le JAR
RUN mvn clean package -DskipTests

# Stage 2: Runtime avec JRE léger
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copier le JAR depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Exposer le port (Render utilisera la variable $PORT)
EXPOSE 8080

# Variable d'environnement pour le port
ENV PORT=8080

# Commande de démarrage
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]