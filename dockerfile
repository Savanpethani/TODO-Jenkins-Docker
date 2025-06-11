# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package manifest and install deps
COPY package*.json ./
RUN npm ci --production

# Copy source
COPY src ./src

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Copy only production deps and source
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY package*.json ./

# Expose port & define start command
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
