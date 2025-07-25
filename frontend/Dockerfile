# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

WORKDIR /app/frontend

# Copy package.json and yarn.lock / package-lock.json to install dependencies
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the Next.js application
# NEXT_PUBLIC_API_BASE_URL must be available at build time for static generation
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
RUN npm run build

# Stage 2: Serve the Next.js application
FROM node:20-alpine AS runner

WORKDIR /app/frontend

# Set production environment
ENV NODE_ENV production

# Copy artifacts from the builder stage
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/package.json ./package.json

# Expose the port Next.js will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]