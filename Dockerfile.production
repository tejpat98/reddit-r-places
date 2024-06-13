# Build step
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the image.
COPY package*.json ./

# Install the dependencies.
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

RUN npm run build

FROM node:20-alpine as runner

WORKDIR /app

COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/package-lock.json ./
COPY --from=builder --chown=node:node /app/next.config.js ./

COPY --from=builder --chown=node:node /app/reddit-r-place-assets ./reddit-r-place-assets

COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/src ./src

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application. 
CMD npm run start