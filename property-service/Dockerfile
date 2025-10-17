# Stage 1: Build with Maven
FROM maven:3.9.11-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy pom.xml and download dependencies first
COPY pom.xml .

# Download dependencies without go-offline
RUN mvn dependency:resolve

# Copy source code
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run app
ENTRYPOINT ["java","-jar","app.jar"]