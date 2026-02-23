docker-compose up -d

backend
  npm install
  npx prisma generate
  npx prisma migrate dev --name init



