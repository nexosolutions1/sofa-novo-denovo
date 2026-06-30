-- =====================================================================
-- SEED INICIAL — Sofá Novo de Novo
-- Popula tabelas públicas com o conteúdo padrão exibido no site.
-- Idempotente: pode ser executado várias vezes sem duplicar registros.
--
-- Como executar:
--   psql "$SUPABASE_DB_URL" -f supabase/seed.sql
-- ou no SQL Editor do painel Supabase: copiar e rodar.
-- =====================================================================

-- ─── SERVIÇOS ────────────────────────────────────────────────────────
INSERT INTO public.services (name, category, icon, description, sort_order, status) VALUES
  ('Higienização de Sofá',     'higienizacao', 'Sparkles',  'Limpeza profunda com extração de sujeira, ácaros e odores.', 1, 'active'),
  ('Higienização de Colchão',  'higienizacao', 'BedDouble', 'Remoção de ácaros, fungos e manchas com produtos hipoalergênicos.', 2, 'active'),
  ('Higienização de Cadeiras', 'higienizacao', 'Armchair',  'Cadeiras de escritório, jantar e poltronas.', 3, 'active'),
  ('Impermeabilização / Blindagem','blindagem','Shield',    'Proteção contra líquidos, manchas e desgaste do tecido.', 4, 'active'),
  ('Higienização Automotiva',  'automotivo',   'Car',       'Bancos, teto, carpetes e portas com finalização premium.', 5, 'active'),
  ('Tapetes e Carpetes',       'higienizacao', 'Layers',    'Limpeza profunda de tapetes residenciais e comerciais.', 6, 'active')
ON CONFLICT DO NOTHING;

-- ─── CALCULADORA / VALORES ───────────────────────────────────────────
INSERT INTO public.calculator_items (kind, name, price, pix_discount_pct, max_installments, sort_order, status) VALUES
  ('higienizacao','Sofá 2 lugares',        180, 5, 10, 1, 'active'),
  ('higienizacao','Sofá 3 lugares',        240, 5, 10, 2, 'active'),
  ('higienizacao','Sofá 4 lugares',        320, 5, 10, 3, 'active'),
  ('higienizacao','Sofá retrátil 2,40m',   360, 5, 10, 4, 'active'),
  ('higienizacao','Colchão solteiro',      150, 5, 10, 5, 'active'),
  ('higienizacao','Colchão casal',         200, 5, 10, 6, 'active'),
  ('higienizacao','Colchão king',          280, 5, 10, 7, 'active'),
  ('blindagem',   'Blindagem sofá 3 lug.', 420, 5, 10, 8, 'active'),
  ('combo',       'Combo higienização + blindagem', 580, 7, 12, 9, 'active')
ON CONFLICT DO NOTHING;

-- ─── DR. BACTÉRIA (singleton) ────────────────────────────────────────
INSERT INTO public.dr_bacteria (title, subtitle, institutional_text, specialist_name, specialty, recognition, seal_label)
SELECT
  'Aprovado pelo Dr. Bactéria',
  'Autoridade nacional em higiene e saúde do ambiente',
  'Nossa metodologia é avaliada e recomendada pelo Dr. Roberto Figueiredo, o Dr. Bactéria — referência nacional em microbiologia, biossegurança e higiene residencial.',
  'Dr. Roberto Figueiredo',
  'Microbiologista — Dr. Bactéria',
  'Mais de 30 anos de pesquisa em higiene e saúde pública',
  'Selo Dr. Bactéria'
WHERE NOT EXISTS (SELECT 1 FROM public.dr_bacteria);

-- ─── LOCAIS / MAPA DO BRASIL ─────────────────────────────────────────
INSERT INTO public.locations (city, state, region, units_count, services_count, sort_order, status) VALUES
  ('São Paulo','SP','Sudeste',45,1200,1,'active'),
  ('Rio de Janeiro','RJ','Sudeste',22,640,2,'active'),
  ('Belo Horizonte','MG','Sudeste',14,380,3,'active'),
  ('Vitória','ES','Sudeste',6,140,4,'active'),
  ('Curitiba','PR','Sul',12,300,5,'active'),
  ('Florianópolis','SC','Sul',7,160,6,'active'),
  ('Porto Alegre','RS','Sul',10,240,7,'active'),
  ('Brasília','DF','Centro-Oeste',9,210,8,'active'),
  ('Goiânia','GO','Centro-Oeste',8,180,9,'active'),
  ('Campo Grande','MS','Centro-Oeste',4,90,10,'active'),
  ('Cuiabá','MT','Centro-Oeste',4,85,11,'active'),
  ('Salvador','BA','Nordeste',11,260,12,'active'),
  ('Recife','PE','Nordeste',9,200,13,'active'),
  ('Fortaleza','CE','Nordeste',9,210,14,'active'),
  ('Natal','RN','Nordeste',5,110,15,'active'),
  ('João Pessoa','PB','Nordeste',4,95,16,'active'),
  ('Maceió','AL','Nordeste',4,90,17,'active'),
  ('Aracaju','SE','Nordeste',3,70,18,'active'),
  ('Teresina','PI','Nordeste',3,65,19,'active'),
  ('São Luís','MA','Nordeste',4,80,20,'active'),
  ('Manaus','AM','Norte',6,130,21,'active'),
  ('Belém','PA','Norte',5,115,22,'active'),
  ('Porto Velho','RO','Norte',3,60,23,'active'),
  ('Rio Branco','AC','Norte',2,40,24,'active'),
  ('Boa Vista','RR','Norte',2,38,25,'active'),
  ('Macapá','AP','Norte',2,42,26,'active'),
  ('Palmas','TO','Norte',3,55,27,'active')
ON CONFLICT DO NOTHING;

-- ─── TECIDOS ATENDIDOS ───────────────────────────────────────────────
INSERT INTO public.fabrics (name, description, sort_order, status) VALUES
  ('Suede',     'Aveludado, exige produtos específicos para preservar a textura.', 1, 'active'),
  ('Veludo',    'Sofisticado, demanda cuidado redobrado para não marcar fibras.', 2, 'active'),
  ('Chenille',  'Trama densa, ótima retenção — limpeza profunda recomendada.', 3, 'active'),
  ('Linho',     'Natural, sensível à umidade. Processo controlado.', 4, 'active'),
  ('Couro',     'Hidratação e limpeza específica para couro natural e sintético.', 5, 'active'),
  ('Courino',   'Material sintético, limpeza com pH neutro.', 6, 'active'),
  ('Algodão',   'Resistente, aceita higienização profunda.', 7, 'active'),
  ('Poliéster', 'Versátil, ótimo para extração úmida.', 8, 'active')
ON CONFLICT DO NOTHING;

-- ─── CONFIGURAÇÕES GLOBAIS ───────────────────────────────────────────
INSERT INTO public.site_settings (key, value) VALUES
  ('whatsapp','+55 11 90000-0000'),
  ('phone','0800 000 0000'),
  ('email','contato@sofanovodenovo.com.br'),
  ('instagram','https://instagram.com/sofanovodenovo'),
  ('hero_title','Seu sofá novo de novo'),
  ('hero_subtitle','Higienização profissional + blindagem premium em todo o Brasil.'),
  ('footer_signature','© Sofá Novo de Novo — Todos os direitos reservados'),
  ('promo_label','PROMOÇÃO DO MÊS'),
  ('promo_text','Combo higienização + blindagem com 7% off no Pix')
ON CONFLICT (key) DO NOTHING;

-- ─── SEO PADRÃO ──────────────────────────────────────────────────────
INSERT INTO public.seo_settings (page, title, description, keywords) VALUES
  ('/',      'Sofá Novo de Novo — Higienização e Blindagem premium',
             'Higienização profunda de sofás, colchões e estofados. Blindagem premium. Atendimento em todo o Brasil.',
             'higienização de sofá, blindagem, impermeabilização, limpeza de colchão'),
  ('/auth',  'Acesso administrativo — Sofá Novo de Novo',
             'Área restrita à equipe Sofá Novo de Novo.',
             'login, admin')
ON CONFLICT (page) DO NOTHING;
