FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate
RUN npm install -g tsx

FROM base AS builder
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma prisma/
COPY tsconfig.json ./
COPY src src/
COPY eslint.config.js .prettierrc .prettierignore ./
RUN pnpm install --ignore-scripts && pnpm add -wD @types/jsonwebtoken @types/swagger-jsdoc @types/swagger-ui-express --ignore-scripts && pnpm prisma generate && pnpm build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/generated /app/generated
COPY --from=builder /app/package.json /app/

USER appuser
EXPOSE 8080
CMD ["tsx", "dist/src/index.js"]
