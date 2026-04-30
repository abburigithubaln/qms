# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY qms_frontend/package*.json ./
RUN npm install
COPY qms_frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend

# Copy frontend build into Spring Boot static folder
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /app/frontend/dist src/main/resources/static

# Copy backend files
COPY qms_backend/pom.xml .
RUN mvn dependency:go-offline

COPY qms_backend/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]