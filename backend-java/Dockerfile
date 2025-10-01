FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy gradle files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY gradle.properties .

# Copy source code
COPY src src

# Install dos2unix to handle Windows line endings and make gradlew executable
RUN apt-get update && apt-get install -y dos2unix && \
    dos2unix gradlew && \
    chmod +x gradlew && \
    rm -rf /var/lib/apt/lists/*

# Build the application
RUN ./gradlew build -x test

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8080

# Run the application
CMD ["./gradlew", "bootRun"]
