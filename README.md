# Sofá Novo de Novo — Site + Painel Administrativo

Plataforma institucional + CMS premium em **TanStack Start / React 19 / Vite 7 / Tailwind v4 / shadcn-ui / Supabase**.

By **[Nova Nexo](https://www.instagram.com/novanexoofc)**.

---

## 1. Stack

- Node.js 20+
- React 19 + TypeScript (strict)
- Vite 7 + TanStack Start (SSR-ready, deploy SPA estático)
- TanStack Router (file-based) + TanStack Query
- Tailwind CSS v4 (`src/styles.css`)
- shadcn-ui (Radix)
- Supabase (Auth + Postgres + Storage + RLS)

## 2. Rodar localmente

```bash
git clone <SEU-REPO>.git
cd sofa-novo-de-novo
cp .env.example .env       # preencha as chaves do Supabase
npm install
npm run dev                # http://localhost:8080
```

Build de produção:

```bash
npm run build              # gera ./dist
npm run preview            # serve o build local
```

## 3. Configurar o Supabase

1. Crie um projeto em https://supabase.com.
2. Copie `Project URL` e `anon/publishable key` para o `.env`.
3. Rode as migrations (na ordem do diretório):

   ```bash
   # via psql
   for f in supabase/migrations/*.sql; do
     psql "$SUPABASE_DB_URL" -f "$f"
   done
   ```

   Ou cole o conteúdo de cada arquivo no **SQL Editor** do painel.
4. Rode o seed inicial:

   ```bash
   psql "$SUPABASE_DB_URL" -f supabase/seed.sql
   ```

### Storage

As migrations já criam o bucket `media` (privado, com URLs assinadas de longa duração). Caso execute manualmente:

```sql
insert into storage.buckets (id, name, public) values ('media','media', false)
on conflict (id) do nothing;
```

### Primeiro administrador

A trigger `handle_new_user` promove automaticamente o e-mail
**nexosolutions01@gmail.com** ao role `admin` no primeiro cadastro.

1. Abra `/auth` no site.
2. Cadastre **nexosolutions01@gmail.com** com uma senha forte.
3. Confirme o e-mail (ou desative o "confirm email" no painel Supabase em ambiente de teste).
4. Faça login → acesso liberado em `/admin`.

> Os usuários comuns recebem o role `viewer` por padrão. Promover outros admins via `/admin/users`.

## 4. Variáveis de ambiente

Listadas em `.env.example`. Mínimo necessário para o site público + painel:

| Variável | Onde | Obrigatória |
|---|---|---|
| `VITE_SUPABASE_URL` | cliente | ✅ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | cliente | ✅ |
| `VITE_SUPABASE_PROJECT_ID` | cliente | recomendado |
| `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` | SSR / server fns | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | jobs admin / webhooks | opcional |

## 5. Rotas

Públicas:

- `/` — site institucional
- `/auth` — login/cadastro

Administrativas (gated por `_authenticated` + role admin/editor):

- `/admin` — dashboard
- `/admin/transformations` — antes/depois
- `/admin/videos` — biblioteca de vídeos
- `/admin/services` — serviços
- `/admin/calculator` — valores e regras de pagamento
- `/admin/dr-bacteria` — bloco institucional Dr. Bactéria
- `/admin/locations` — mapa do Brasil
- `/admin/fabrics` — tecidos atendidos
- `/admin/media` — biblioteca de mídia
- `/admin/seo` — SEO por página
- `/admin/settings` — configurações chave/valor
- `/admin/users` — gestão de papéis

## 6. Deploy — Netlify

`netlify.toml` já incluído.

1. Faça push para o GitHub.
2. No Netlify: **Add new site → Import from GitHub**.
3. Build command: `npm run build` · Publish dir: `dist`.
4. **Site settings → Environment variables**: cole todas as variáveis do `.env`.
5. Deploy. Domínio custom em **Domain settings**.

## 7. Marca BY NOVA NEXO

- Rodapé público (`src/routes/index.tsx`)
- Sidebar admin (`src/components/admin/AdminSidebar.tsx`)
- Componente: `src/components/NovaNexoBadge.tsx` → link para [@nova.nexo](https://www.instagram.com/novanexoofc)

## 8. Estrutura

```
src/
  routes/                 # file-based routing
    __root.tsx
    index.tsx             # home pública
    auth.tsx
    _authenticated/       # gate + painel
  components/
    site/                 # BrazilMap, DrBacteriaSection, ...
    admin/                # AdminSidebar, CrudPage, ImageField, ...
    ui/                   # shadcn-ui
    NovaNexoBadge.tsx
  integrations/supabase/  # client, types, middleware
  lib/                    # server fns + utilitários
  styles.css              # Tailwind v4
supabase/
  migrations/             # schema + RLS + grants + trigger admin
  seed.sql                # conteúdo inicial do site
netlify.toml
```

## 9. Problemas comuns

| Sintoma | Causa / solução |
|---|---|
| `/admin` redireciona para `/auth` | sem sessão ou role insuficiente — login com conta admin |
| Tela branca em `/auth` | conferir `VITE_SUPABASE_*` |
| `permission denied for table ...` | re-rodar a migration: cada `CREATE TABLE` exige `GRANT` |
| `Expected 3 parts in JWT; got 1` | misturou key nova (`sb_publishable_`) com client que espera JWT — use sempre a publishable key indicada |
| Upload de mídia 403 | bucket `media` ausente — rodar SQL acima |
| 404 ao recarregar rota | adicionar o redirect SPA (já incluso no `netlify.toml`) |

---

**Pronto para VS Code → GitHub → Netlify.**
