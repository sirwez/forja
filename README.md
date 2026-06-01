# Forja Brindes — RPG Premium Store

Nova proposta visual para a Forja Brindes com conceito de Geek Store / guilda de itens personalizados.

## Arquivos

- `index.html`: home com Balcão da Forja, coleções, inventário, item lendário, confiança e Elfsight.
- `produtos.html`: catálogo completo com filtros.
- `produto.html`: página dedicada/ficha do item.
- `admin.html`: painel administrativo com Supabase Auth.
- `css/style.css`: identidade visual premium RPG/forja.
- `js/data.js`: dados fallback e integração de leitura.
- `js/main.js`: renderização da loja, filtros e produto.
- `js/admin.js`: CRUD básico do inventário.
- `sql/schema.sql`: tabelas e RLS.

## Como testar localmente

Evite abrir por `file:///`, porque embeds e navegação podem ser bloqueados pelo navegador. Use um servidor local:

```bash
python -m http.server 8000
```

Depois acesse:

```txt
http://localhost:8000
```

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Rode o conteúdo de `sql/schema.sql` no SQL Editor.
3. Crie um usuário em Authentication.
4. Adicione esse usuário na tabela `admin_users`.
5. Edite `js/supabase.js` com sua URL e anon key.

## Primeiro admin

Depois de criar o usuário em Auth, rode:

```sql
insert into admin_users (user_id, email)
select id, email from auth.users where email = 'SEU_EMAIL_AQUI';
```

## Shopee

O MVP usa o campo `shopee_url`. Se existir link no produto, o botão exibe “Comprar na Shopee”. Se não existir, o botão direciona para WhatsApp.

## Instagram / Elfsight

O embed do Elfsight está inserido na home com o código fornecido:

```html
<script src="https://elfsightcdn.com/platform.js" async></script>
<div class="elfsight-app-93e99fc6-c322-42bf-ac50-18b49ebe7817" data-elfsight-app-lazy></div>
```

Ele funciona melhor em ambiente publicado ou servidor local, não em `file:///`.

## GitHub Pages

Suba todos os arquivos para o repositório e ative GitHub Pages apontando para a branch principal.
