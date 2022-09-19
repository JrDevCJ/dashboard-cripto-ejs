FROM node:16.14-alpine
LABEL version="1.0.0" description="Cripto Dashboard" maintainer="CJ"
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
# define o diretório de trabalho da aplicação
WORKDIR /home/node/app
# copia os arquivos package.json e package-lock.json
COPY package*.json ./
RUN yarn install
RUN npm install pm2 -g
# Copie o código de sua aplicação para o diretório de trabalho
COPY . .
# copia as permissões do diretório da aplicação para o diretório no container
COPY --chown=node:node . .
# Defina o usuário para node
USER node
RUN yarn build
EXPOSE 3000
CMD ["pm2-runtime","dist/server.js"]
