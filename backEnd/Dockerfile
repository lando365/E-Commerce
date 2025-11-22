# Stage 1: Build avec Maven
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Définir l'encodage UTF-8 pour éviter les problèmes
ENV MAVEN_OPTS="-Dfile.encoding=UTF-8"

# Copier pom.xml et télécharger les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Compiler et créer le JAR avec encodage UTF-8 forcé
RUN mvn clean package -DskipTests -Dproject.build.sourceEncoding=UTF-8 -Dproject.reporting.outputEncoding=UTF-8

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