# ERCA LOC — site institucional + painel administrativo

Site da **ERCA LOC | Locação de Tecnologia**, com abertura animada da marca, vitrine de equipamentos com preços e todos os botões comerciais levando ao WhatsApp. O conteúdo é editado num painel em `/admin`, sem precisar mexer no código nem publicar de novo.

| Tecnologia | Uso |
|---|---|
| Next.js 16 + TypeScript | Site e painel |
| Tailwind CSS 4 | Visual |
| PostgreSQL + Prisma 7 | Textos, equipamentos, banners, vídeos, administradores |
| Cloudinary (opcional) | Armazenamento das imagens enviadas |
| GitHub + Railway | Versionamento e publicação |

---

## O que o site tem

- **Abertura animada**: o símbolo é desenhado e se transforma na logo oficial antes de revelar o site. Aparece uma vez por visita, tem botão "Pular" e pode ser desligada no painel.
- **Cena interativa no topo**: monitor, notebook e celular flutuando sem fundo e reagindo ao mouse. O monitor mostra os banners do painel, o notebook mostra o inventário e o celular mostra uma conversa de WhatsApp.
- **Como funciona**: caixa da ERCA LOC abrindo com o notebook subindo, mais as etapas da locação (editáveis).
- **Seções**: Início, Quem somos, Equipamentos (filtro por categoria e fotos sem fundo flutuando), Como funciona, Gestão de inventário, Suporte técnico, Vídeos e Contato.
- **WhatsApp**: cada botão abre o WhatsApp com uma mensagem pronta, inclusive com o nome do equipamento escolhido. Também há um botão flutuante.
- **Preços**: o valor aparece como "A partir de R$ 249,90/mês", com observação. Sem valor cadastrado, o card mostra "Sob consulta".

## O que o painel (`/admin`) permite

- Editar títulos, textos, destaques, dados de contato e redes sociais.
- Cadastrar, editar, ordenar, ocultar e excluir equipamentos, com preço, foto e categoria.
- Gerenciar categorias, banners (exibidos na tela do monitor do topo) e vídeos do YouTube ou Vimeo.
- Dica: envie as fotos dos equipamentos em PNG ou WEBP **sem fundo**, para que flutuem no site.
- Enviar imagens e usar a biblioteca de imagens. A logo oficial também pode ser enviada.
- Alterar o número do WhatsApp e as mensagens prontas.
- Trocar o próprio e-mail e a senha, e sair da sessão.

## Segurança

- Senhas guardadas só como hash (bcrypt). Trocar a senha encerra as outras sessões.
- Sessão em cookie `httpOnly`, assinado (JWT HS256) e com validade de 8 horas.
- Todas as páginas, ações e rotas do painel conferem o login no servidor.
- Limite de tentativas de login por IP.
- Uploads validados pelo conteúdo real do arquivo (JPG, PNG, WEBP, GIF ou AVIF; SVG não é aceito) e pelo tamanho máximo.
- Segredos só em variáveis de ambiente. O `.env` não vai para o GitHub (veja `.env.example`).

---

## 1. Rodar no seu computador

Pré-requisitos: **Node.js 20.19 ou mais novo** e um **PostgreSQL**. Para o banco, você pode usar um local ou criar um banco grátis na própria Railway e copiar a `DATABASE_URL`.

```bash
npm install
cp .env.example .env      # no Windows: copy .env.example .env
# edite o .env com a DATABASE_URL, a SESSION_SECRET e o primeiro admin
npx prisma migrate deploy # cria as tabelas
npm run dev
```

Abra <http://localhost:3000> para ver o site e <http://localhost:3000/admin> para o painel.

Na primeira execução, o sistema cria sozinho:
- os textos do briefing;
- os 4 equipamentos iniciais e o banner;
- o administrador definido em `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### Alterar o banco (migrations)

1. Edite `prisma/schema.prisma`.
2. Rode `npm run db:migrate -- --name descricao-da-mudanca`. Isso gera uma pasta nova em `prisma/migrations`.
3. Faça o commit da pasta gerada. Na Railway, a migration é aplicada sozinha no próximo deploy (`npm start` roda `prisma migrate deploy`).

---

## 2. Versionar no GitHub

1. Crie um repositório **privado** e vazio no GitHub, sem marcar README.
2. Na pasta do projeto:

```bash
git add .
git commit -m "Primeira versão do site ERCA LOC"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/erca-loc.git
git push -u origin main
```

Depois disso, cada `git push` na branch `main` publica o site automaticamente na Railway.

---

## 3. Publicar na Railway

1. **Crie o projeto**: New Project → **Deploy from GitHub repo** → escolha o repositório.
2. **Adicione o banco**: no projeto, clique em **+ Create** (ou botão direito no quadro) → **Database** → **PostgreSQL**.
3. **Variáveis do serviço do site** (aba **Variables**). O jeito mais fácil é o **Raw Editor**:

   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   SESSION_SECRET=cole-aqui-uma-sequencia-aleatoria-de-40-caracteres
   ADMIN_EMAIL=seu-email@empresa.com.br
   ADMIN_PASSWORD=uma-senha-forte-com-10-ou-mais
   ```

   - Se o banco tiver outro nome no quadro, troque `Postgres` pelo nome dele.
   - Para gerar a `SESSION_SECRET` no Windows (PowerShell):
     `-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | % {[char]$_})`

4. **Domínio**: aba **Settings → Networking → Generate Domain**. Se for pedida uma porta, use `8080` ou deixe a que a Railway sugerir. O app usa a variável `PORT` automaticamente.
5. **Verificação de saúde (opcional)**: em **Settings → Deploy → Healthcheck Path**, coloque `/api/health`.
6. Clique em **Deploy** e aguarde ficar **Online**.
7. Acesse `https://SEU-DOMINIO/admin`, entre com o e-mail e a senha das variáveis e **troque a senha** em *Minha conta*.
8. Em **Textos, contato e WhatsApp → WhatsApp**, cadastre o número oficial (ex.: `5511987654321`).

> Não é preciso volume na Railway: o conteúdo fica no PostgreSQL e as imagens ficam no Cloudinary ou no próprio PostgreSQL.

### Imagens no Cloudinary (recomendado)

1. Crie uma conta grátis em <https://cloudinary.com>.
2. No Dashboard, copie a **API environment variable**. Ela começa com `cloudinary://`.
3. Na Railway, crie a variável `CLOUDINARY_URL` com esse valor e faça um novo deploy.

Sem o Cloudinary, as imagens enviadas ficam salvas no PostgreSQL. Isso funciona, mas é menos indicado para muitas imagens grandes.

### Domínio próprio

Na Railway, vá em **Settings → Networking → Custom Domain**, digite o domínio (ex.: `www.ercaloc.com.br`) e crie no seu provedor de domínio (Registro.br, por exemplo) o registro **CNAME** que a Railway mostrar. O HTTPS é configurado sozinho. Depois, preencha a variável `SITE_URL` com o endereço final.

---

## Estrutura

```
prisma/
  schema.prisma          modelo do banco
  migrations/            histórico de alterações do banco
src/
  app/
    page.tsx             site (abertura + seções)
    admin/               login e painel (/admin)
    api/                 envio de imagens, imagens do banco e verificação de saúde
  components/
    site/                seções do site, abertura animada, cards
    admin/               formulários, campo de imagem, menu do painel
    Logo.tsx             logo vetorial (símbolo + ERCA LOC)
  lib/
    settings.ts          lista de textos editáveis e conteúdo inicial
    bootstrap.ts         preparação da primeira execução
    auth.ts              login e sessão
    media.ts             upload (Cloudinary ou banco)
  proxy.ts               proteção das rotas /admin
public/seed/             fotos iniciais dos equipamentos
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Gera o cliente do Prisma e o build de produção (não precisa do banco) |
| `npm start` | Aplica as migrations e inicia o site |
| `npm run db:migrate` | Cria uma migration nova (desenvolvimento) |
| `npm run db:studio` | Abre o Prisma Studio para ver o banco |
| `npm run lint` / `npm run typecheck` | Verificações de código |

## Fora do escopo (conforme o briefing)

E-commerce, carrinho, pagamento online, contratos, CRM, cadastro de clientes e portal do cliente. A conversão comercial é feita pelo WhatsApp.
