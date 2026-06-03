FROM node:20-alpine

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci

COPY . .

# Build the Next.js application (generates static files in /app/out)
RUN npm run build

# When the container starts, copy the static files to the mounted volume
CMD ["sh", "-c", "cp -a /app/out/. /app/dist/"]
