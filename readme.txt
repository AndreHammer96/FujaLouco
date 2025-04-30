PASSO A PASSO PARA DEPLOY NO RAILWAY:

1. Instale o Railway CLI se ainda não tiver:
   npm i -g railway

2. No terminal, vá até a pasta do projeto:
   cd MapaDosTcha

3. Faça login no Railway (se ainda não tiver feito):
   railway login

4. Inicie o projeto Railway:
   railway init

5. Faça o deploy:
   railway up

OBS:
- O backend está em /backend
- O frontend (mapa) está em /frontend
- O servidor já está pronto para lidar com localização em tempo real.