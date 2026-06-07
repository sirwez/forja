# Forja Brindes — Geek Store + Painel da Guilda

Projeto em **Vue 3 + Vite + Supabase** para a Forja Brindes.

A loja pública mantém a estética de **Balcão de Forja**, RPG premium, fagulhas, inventário e sistema de manhwa coreano. O painel administrativo foi reestruturado para parecer um sistema real, com dashboard, listagem, filtros, CRUD, upload de imagens e controle de status.

## Stack

- Vue 3
- Vite
- Vue Router
- Supabase Auth
- Supabase Database
- Supabase Storage
- CSS customizado sem Tailwind CDN

## Como rodar localmente

```bash
npm install
npm run dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
VITE_WHATSAPP_NUMBER=558688843379
```

Sem Supabase configurado, a loja pública usa dados demonstrativos. O admin exige Supabase configurado.

## Supabase

1. Crie um projeto no Supabase.
2. Vá em **SQL Editor**.
3. Rode o arquivo `sql/schema.sql`.
4. Crie um usuário em **Authentication > Users**.
5. Adicione esse usuário como admin:

```sql
insert into public.admin_users (email)
values ('seu-email@exemplo.com');
```

O acesso administrativo é bloqueado se o usuário não existir em `admin_users`.

## Storage

O SQL cria o bucket público `products` com limite de 6MB e tipos permitidos:

- JPG/JPEG
- PNG
- WebP

As policies permitem:

- leitura pública das imagens;
- upload apenas para admin;
- update/delete apenas para admin.

## Rotas

Como o projeto usa `createWebHashHistory`, funciona bem no GitHub Pages sem configuração extra de rewrite.

- `#/` — Home
- `#/produtos` — Catálogo completo
- `#/produto/:slug` — Página individual do produto
- `#/admin/login` — Login do painel
- `#/admin` — Dashboard
- `#/admin/produtos` — Inventário admin
- `#/admin/produtos/novo` — Cadastro
- `#/admin/produtos/:id` — Edição
- `#/admin/categorias` — Coleções

## Publicação no GitHub Pages

```bash
npm run build
```

Publique a pasta `dist`.

Se usar GitHub Pages em repositório comum, o `base: './'` no `vite.config.js` já ajuda a manter assets relativos.

## Recursos implementados

### Loja pública

- Home com conceito Balcão da Forja.
- Fagulhas animadas.
- Cards de produto como slots de inventário.
- Coleções como cartas.
- Catálogo completo com filtros.
- Página individual do produto como ficha de item.
- CTA para WhatsApp e Shopee.
- Embed Elfsight com fallback.
- Mobile tratado como app de catálogo.

### Admin

- Login com Supabase Auth.
- Proteção por `admin_users`.
- Dashboard com métricas.
- Alertas de produtos sem imagem ou sem ação comercial.
- Listagem desktop em tabela.
- Listagem mobile em cards.
- Filtros por busca, categoria, status e raridade.
- Ativar/desativar produto.
- Copiar link público.
- Excluir com confirmação.
- Cadastro/edição em formulário seccionado.
- Upload real de imagem principal.
- Upload múltiplo de galeria.
- Preview das imagens.
- Gerenciamento de categorias.
- Toasts e estados de loading/erro.

## Observações

A compra pela Shopee continua como link manual por produto, usando o campo `shopee_url`. Não há checkout interno.

O botão “Forjar pelo WhatsApp” monta uma mensagem com o nome do produto e contexto de personalização.

## SEO e publicação

Esta versão inclui melhorias de SEO técnico:

- Metatags completas de título, descrição, Open Graph e Twitter Cards.
- Metatags dinâmicas por página usando `src/composables/useSeo.js`.
- Dados estruturados JSON-LD para loja, site, listas de produtos e página de produto.
- `robots.txt` e `sitemap.xml` gerados automaticamente no build.
- Rotas limpas com `createWebHistory`, melhores para SEO do que URLs com `#`.
- `404.html` para fallback de SPA em hospedagens como GitHub Pages.
- Imagens com `alt`, `loading="lazy"`, `decoding="async"` e `fetchpriority` no destaque.
- Área admin marcada como `noindex, nofollow`.

### Configurar domínio antes de publicar

No arquivo `.env`, configure:

```env
VITE_SITE_URL=https://www.seudominio.com.br
VITE_BASE_PATH=/
VITE_ROUTER_BASE=/
```

Se publicar em GitHub Pages em um repositório, use o caminho do repositório:

```env
VITE_SITE_URL=https://usuario.github.io/repositorio
VITE_BASE_PATH=/repositorio/
VITE_ROUTER_BASE=/repositorio/
```

Depois rode:

```bash
npm run build
```

O build vai gerar `robots.txt` e `sitemap.xml` dentro de `dist/` com base em `VITE_SITE_URL`.

### Depois de publicar

1. Cadastrar o domínio no Google Search Console.
2. Enviar o sitemap: `https://seudominio.com.br/sitemap.xml`.
3. Testar páginas no Rich Results Test do Google.
4. Rodar PageSpeed Insights e reduzir imagens pesadas se necessário.
5. Criar/otimizar o Perfil da Empresa no Google para buscas locais em Timon e Teresina.
6. Manter produtos com nomes claros, descrição única, preço quando possível e imagens com boa qualidade.
