# Utiliser l'image officielle Node.js comme image de base
FROM node:14 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Mettre à jour npm à une version compatible avec Node.js v14
RUN npm install -g npm@6

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Construire l'application Angular
RUN npm run build --prod

# Étape 2 : Serveur NGINX
FROM nginx:alpine

# Copier les fichiers de build Angular vers le répertoire de NGINX
COPY --from=build /app/dist/[NOM_DU_PROJET] /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer NGINX
CMD ["nginx", "-g", "daemon off;"]
