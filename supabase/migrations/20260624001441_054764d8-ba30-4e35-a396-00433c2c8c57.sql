
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE public.content_status AS ENUM ('active', 'draft', 'archived');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ HAS_ROLE FUNCTION ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor')) $$;

-- ============ PROFILES POLICIES ============
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_admin_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(),'admin'));

-- ============ USER_ROLES POLICIES ============
CREATE POLICY "roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ HANDLE NEW USER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  -- bootstrap first admin
  IF NEW.email = 'phalvesbassam@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ============ CONTENT TABLES ============
-- transformations
CREATE TABLE public.transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  city TEXT,
  image_before TEXT,
  image_after TEXT,
  video_url TEXT,
  description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transformations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.transformations TO authenticated;
GRANT ALL ON public.transformations TO service_role;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transformations_public_read" ON public.transformations FOR SELECT USING (status='active' OR public.is_staff(auth.uid()));
CREATE POLICY "transformations_staff_write" ON public.transformations FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "transformations_staff_update" ON public.transformations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "transformations_admin_delete" ON public.transformations FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_transformations_updated BEFORE UPDATE ON public.transformations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- videos
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "videos_public_read" ON public.videos FOR SELECT USING (status='active' OR public.is_staff(auth.uid()));
CREATE POLICY "videos_staff_write" ON public.videos FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "videos_staff_update" ON public.videos FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "videos_admin_delete" ON public.videos FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_videos_updated BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  category TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (status='active' OR public.is_staff(auth.uid()));
CREATE POLICY "services_staff_write" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "services_staff_update" ON public.services FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "services_admin_delete" ON public.services FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- calculator_items
CREATE TABLE public.calculator_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,            -- 'item' | 'service' | 'promo'
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  pix_discount_pct INT DEFAULT 5,
  max_installments INT DEFAULT 10,
  sort_order INT NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.calculator_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.calculator_items TO authenticated;
GRANT ALL ON public.calculator_items TO service_role;
ALTER TABLE public.calculator_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "calc_public_read" ON public.calculator_items FOR SELECT USING (status='active' OR public.is_staff(auth.uid()));
CREATE POLICY "calc_staff_write" ON public.calculator_items FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "calc_staff_update" ON public.calculator_items FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "calc_admin_delete" ON public.calculator_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_calc_updated BEFORE UPDATE ON public.calculator_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- locations
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  region TEXT,
  latitude NUMERIC(8,4),
  longitude NUMERIC(8,4),
  units_count INT DEFAULT 1,
  services_count INT DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'active',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.locations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loc_public_read" ON public.locations FOR SELECT USING (status='active' OR public.is_staff(auth.uid()));
CREATE POLICY "loc_staff_write" ON public.locations FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "loc_staff_update" ON public.locations FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "loc_admin_delete" ON public.locations FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_loc_updated BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- fabrics
CREATE TABLE public.fabrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fabrics TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.fabrics TO authenticated;
GRANT ALL ON public.fabrics TO service_role;
ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fab_public_read" ON public.fabrics FOR SELECT USING (status='active' OR public.is_staff(auth.uid()));
CREATE POLICY "fab_staff_write" ON public.fabrics FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "fab_staff_update" ON public.fabrics FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "fab_admin_delete" ON public.fabrics FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_fab_updated BEFORE UPDATE ON public.fabrics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- dr_bacteria (single row institutional content)
CREATE TABLE public.dr_bacteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  description TEXT,
  specialist_name TEXT DEFAULT 'Roberto Figueiredo',
  specialty TEXT DEFAULT 'Microbiologia',
  recognition TEXT DEFAULT 'Referência nacional em higiene e microbiologia.',
  institutional_text TEXT,
  seal_label TEXT DEFAULT 'Selo de Aprovação',
  primary_image TEXT,
  secondary_image TEXT,
  cards JSONB DEFAULT '[]'::jsonb,
  seals JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.dr_bacteria TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.dr_bacteria TO authenticated;
GRANT ALL ON public.dr_bacteria TO service_role;
ALTER TABLE public.dr_bacteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drb_public_read" ON public.dr_bacteria FOR SELECT USING (true);
CREATE POLICY "drb_staff_write" ON public.dr_bacteria FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "drb_staff_update" ON public.dr_bacteria FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "drb_admin_delete" ON public.dr_bacteria FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_drb_updated BEFORE UPDATE ON public.dr_bacteria FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- site_settings (key/value)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ss_public_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "ss_staff_write" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "ss_staff_update" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "ss_admin_delete" ON public.site_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_ss_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- seo_settings (per page)
CREATE TABLE public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.seo_settings TO authenticated;
GRANT ALL ON public.seo_settings TO service_role;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seo_public_read" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "seo_staff_write" ON public.seo_settings FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "seo_staff_update" ON public.seo_settings FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "seo_admin_delete" ON public.seo_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_seo_updated BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- media_library
CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT,
  category TEXT,                 -- 'image' | 'video' | 'logo' | 'favicon' | 'document'
  size_bytes BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_library TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT ALL ON public.media_library TO service_role;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media_staff_read" ON public.media_library FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "media_staff_write" ON public.media_library FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "media_staff_update" ON public.media_library FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "media_admin_delete" ON public.media_library FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- audit_logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_admin_read" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "audit_staff_insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

-- ============ SEED LOCATIONS ============
INSERT INTO public.locations (city, state, region, latitude, longitude, units_count, services_count) VALUES
('Curitiba','PR','Sul',-25.4284,-49.2733,8,420),
('Londrina','PR','Sul',-23.3045,-51.1696,3,180),
('Maringá','PR','Sul',-23.4253,-51.9386,3,160),
('Joinville','SC','Sul',-26.3044,-48.8456,4,210),
('Florianópolis','SC','Sul',-27.5954,-48.5480,5,260),
('Blumenau','SC','Sul',-26.9194,-49.0661,3,150),
('Porto Alegre','RS','Sul',-30.0346,-51.2177,7,380),
('Caxias do Sul','RS','Sul',-29.1678,-51.1794,3,170),
('São Paulo','SP','Sudeste',-23.5505,-46.6333,28,1820),
('Campinas','SP','Sudeste',-22.9099,-47.0626,6,340),
('Ribeirão Preto','SP','Sudeste',-21.1775,-47.8103,4,210),
('São José dos Campos','SP','Sudeste',-23.2237,-45.9009,3,180),
('Santos','SP','Sudeste',-23.9608,-46.3331,3,160),
('São Caetano do Sul','SP','Sudeste',-23.6189,-46.5547,2,140),
('Rio de Janeiro','RJ','Sudeste',-22.9068,-43.1729,18,1240),
('Niterói','RJ','Sudeste',-22.8833,-43.1036,4,220),
('Volta Redonda','RJ','Sudeste',-22.5202,-44.0996,2,120),
('Resende','RJ','Sudeste',-22.4694,-44.4471,2,100),
('Belo Horizonte','MG','Sudeste',-19.9167,-43.9345,10,640),
('Uberlândia','MG','Sudeste',-18.9186,-48.2772,4,210),
('Juiz de Fora','MG','Sudeste',-21.7642,-43.3503,3,170),
('Vitória','ES','Sudeste',-20.3155,-40.3128,4,200),
('Brasília','DF','Centro-Oeste',-15.7939,-47.8828,9,540),
('Goiânia','GO','Centro-Oeste',-16.6864,-49.2643,5,290),
('Campo Grande','MS','Centro-Oeste',-20.4697,-54.6201,3,160),
('Cuiabá','MT','Centro-Oeste',-15.6010,-56.0974,3,150),
('Salvador','BA','Nordeste',-12.9777,-38.5016,8,460),
('Recife','PE','Nordeste',-8.0476,-34.8770,7,380),
('Fortaleza','CE','Nordeste',-3.7172,-38.5433,7,360),
('Natal','RN','Nordeste',-5.7945,-35.2110,3,160),
('João Pessoa','PB','Nordeste',-7.1195,-34.8450,3,140),
('Maceió','AL','Nordeste',-9.6498,-35.7089,3,130),
('Aracaju','SE','Nordeste',-10.9472,-37.0731,2,110),
('Teresina','PI','Nordeste',-5.0892,-42.8019,2,110),
('São Luís','MA','Nordeste',-2.5297,-44.3028,3,130),
('Manaus','AM','Norte',-3.1190,-60.0217,5,260),
('Belém','PA','Norte',-1.4558,-48.5044,4,210),
('Porto Velho','RO','Norte',-8.7619,-63.9039,2,90),
('Rio Branco','AC','Norte',-9.9747,-67.8243,2,80),
('Boa Vista','RR','Norte',-2.8235,-60.6758,2,70),
('Macapá','AP','Norte',0.0356,-51.0705,2,80),
('Palmas','TO','Norte',-10.1840,-48.3336,2,90);

-- ============ SEED DR BACTÉRIA ============
INSERT INTO public.dr_bacteria (title, subtitle, description, institutional_text, cards, seals) VALUES (
  'Serviço Validado pelo Dr. Bactéria',
  'Padrão de higienização profissional referência nacional.',
  'Produtos, procedimentos e padrões alinhados às melhores práticas de microbiologia.',
  'A Sofá Novo de Novo utiliza produtos, procedimentos e padrões alinhados às melhores práticas de higienização profissional, levando mais segurança, saúde e qualidade para famílias e empresas.',
  '[{"title":"Produtos aprovados","desc":"Soluções biodegradáveis testadas em laboratório."},{"title":"Análise especializada","desc":"Monitoramento técnico-científico contínuo."},{"title":"Procedimentos profissionais","desc":"Equipes treinadas conforme protocolos premium."},{"title":"Segurança para famílias","desc":"Ambientes seguros para crianças, pets e idosos."}]'::jsonb,
  '[{"label":"Selo Dr. Bactéria"},{"label":"Microbiologia"},{"label":"Padrão Premium"}]'::jsonb
);

-- ============ SEED SITE SETTINGS ============
INSERT INTO public.site_settings (key, value) VALUES
('whatsapp','5500000000000'),
('instagram','https://instagram.com/sofanovodenovo'),
('facebook',''),
('phone',''),
('email','contato@sofanovodenovo.com.br'),
('address','');
