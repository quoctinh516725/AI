FROM node:20-alpine

WORKDIR /app

# Cài đặt openssl phục vụ cho Prisma Client
RUN apk add --no-cache openssl

# Copy file cấu hình package và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Tạo Prisma Client
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

EXPOSE 3001

# Khởi chạy server
CMD ["npm", "run", "start"]
