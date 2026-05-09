-- ============================================================
-- Matty Material Library — Full Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- ── Materials ────────────────────────────────────────────────

CREATE TABLE materials (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_number       text UNIQUE NOT NULL,
  name                  text NOT NULL,
  short_name            text,

  -- Classification
  category              text NOT NULL CHECK (category IN ('Woven','Non-Woven','Filling','Knit','Leather','Technical')),
  subcategory           text,
  material_state        text NOT NULL DEFAULT 'Active' CHECK (material_state IN ('Active','Inactive','Archived','Deactivated')),

  -- Composition & construction
  composition           text,
  weight                text,
  width                 text,
  technical_construction text,
  manufacture_detail    text,
  warp_weft             text,
  finish                text,
  dyeing_method         text,
  print_type            text,

  -- Sourcing
  brand                 text,
  library               text,
  supplier_ids          text[],           -- array of supplier names/codes
  country_of_origin     text,
  lead_time_days        int,
  moq                   text,             -- minimum order quantity, e.g. "500 m"
  price_per_unit        numeric(10,4),
  currency              text DEFAULT 'EUR',

  -- Sustainability
  certifications        text[],           -- e.g. ['GOTS','OEKO-TEX','GRS']
  recycled_content_pct  int,
  is_sustainable        boolean DEFAULT false,
  care_instructions     text,
  end_of_life           text,             -- e.g. 'Recyclable', 'Compostable'

  -- Risk & compliance
  risk_level            text CHECK (risk_level IN ('Low','Medium','High')),
  risk_comments         text,
  restricted_substances text[],

  -- Usage & application
  suitable_for          text[],           -- e.g. ['Outerwear','Knitwear','Lining']
  season                text[],           -- e.g. ['SS25','FW25']
  tags                  text[],
  preview_color         text,             -- hex colour for UI
  image_url             text,

  -- Metadata
  created_by            uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now(),
  last_tested_at        timestamptz,
  notes                 text
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX materials_category_idx      ON materials(category);
CREATE INDEX materials_brand_idx         ON materials(brand);
CREATE INDEX materials_material_state_idx ON materials(material_state);

-- ── Chat: Threads & Messages ─────────────────────────────────

CREATE TABLE threads (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN ('user', 'bot')),
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX messages_thread_id_idx ON messages(thread_id);
CREATE INDEX threads_user_id_idx    ON threads(user_id);


-- ============================================================
-- SEED DATA — 40 materials
-- ============================================================

INSERT INTO materials (
  material_number, name, short_name,
  category, subcategory, material_state,
  composition, weight, width,
  technical_construction, manufacture_detail, warp_weft,
  finish, dyeing_method,
  brand, library, country_of_origin, lead_time_days, moq, price_per_unit, currency,
  certifications, recycled_content_pct, is_sustainable, care_instructions, end_of_life,
  risk_level, risk_comments,
  suitable_for, season, tags, preview_color
) VALUES

-- 1
('5003','SDJ-MYKITTED0611','SDJ-MYKITTED0611',
 'Woven','Twill','Deactivated',
 '50% Cotton, 50% Polyester','230 g/m²','150 cm',
 'Twill Weave',NULL,'Warp 2 / Weft 3',
 'Preshrunk',NULL,
 'Vero Moda','Core Library','China',60,'500 m',2.40,'EUR',
 ARRAY['OEKO-TEX'],0,false,'30°C machine wash','Recyclable',
 'Low',NULL,
 ARRAY['Casualwear','Workwear'],ARRAY['SS25','FW25'],ARRAY['cotton','polyester','twill'],'#b8cfe8'),

-- 2
('1728','PLY-FLATFILL-W01','PLY-FLATFILL-W01',
 'Filling','Flat Filling - Woven','Active',
 '100% Polyester','232 g/m²','200 cm',
 NULL,NULL,'Warp 3 / Weft 4',
 NULL,NULL,
 'JUNAROSE','Filling Library','China',45,'1000 m',1.10,'EUR',
 ARRAY[]::text[],0,false,'Do not wash','Recyclable',
 'Low',NULL,
 ARRAY['Outerwear','Jackets'],ARRAY['FW25'],ARRAY['polyester','filling','woven'],'#d4d0c8'),

-- 3
('1670','PLY-FLATFILL-NW02','PLY-FLATFILL-NW02',
 'Filling','Flat Filling - Non Woven','Active',
 '100% Polyester','242 g/m²','200 cm',
 'Chemical','Bonded',NULL,
 NULL,NULL,
 'JUNAROSE','Filling Library','China',45,'1000 m',0.95,'EUR',
 ARRAY[]::text[],0,false,'Do not wash','Not recyclable',
 'Medium','"Risky business"',
 ARRAY['Outerwear','Quilted Jackets'],ARRAY['FW25'],ARRAY['polyester','filling','non-woven'],'#e8e4dc'),

-- 4
('2201','CRG-CALF-SMOOTH01','CRG-CALF-SMOOTH01',
 'Leather','Smooth','Active',
 '100% Calf Leather','1.2 mm','Variable',
 'Full Grain',NULL,NULL,
 'Aniline',NULL,
 'Selected Homme','Leather Library','Italy',90,'50 hides',38.00,'EUR',
 ARRAY['Leather Working Group'],0,false,'Specialist clean only','Not recyclable',
 'High','Animal-derived material — requires compliance sign-off',
 ARRAY['Bags','Shoes','Accessories'],ARRAY['SS25','FW25'],ARRAY['leather','calf','smooth'],'#c4a882'),

-- 5
('3301','KNT-JERSEY-M100','KNT-JERSEY-M100',
 'Knit','Jersey','Active',
 '100% Merino Wool','180 g/m²','160 cm',
 'Single Jersey',NULL,NULL,
 'Natural','Piece Dyed',
 'Vero Moda','Premium Library','Italy',75,'300 m',14.50,'EUR',
 ARRAY['RWS','GOTS'],0,true,'Hand wash cold','Compostable',
 'Low',NULL,
 ARRAY['Knitwear','Base Layers','Tops'],ARRAY['FW25'],ARRAY['wool','merino','jersey','sustainable'],'#8c99a8'),

-- 6
('4102','TCH-RIPSTOP-N66','TCH-RIPSTOP-N66',
 'Technical','Ripstop','Active',
 '100% Nylon 6.6','68 g/m²','148 cm',
 'Ripstop Weave','DWR Coated',NULL,
 'DWR','Yarn Dyed',
 'Jack & Jones','Technical Library','Taiwan',50,'500 m',4.80,'EUR',
 ARRAY['bluesign'],0,false,'30°C machine wash','Not recyclable',
 'Low',NULL,
 ARRAY['Activewear','Outerwear','Technical Garments'],ARRAY['SS25','FW25'],ARRAY['nylon','technical','ripstop','DWR'],'#3a4a5c'),

-- 7
('5104','LIN-LINEN-PLAIN01','LIN-LINEN-PLAIN01',
 'Woven','Plain Weave','Deactivated',
 '100% Linen','185 g/m²','145 cm',
 'Plain Weave',NULL,'Warp 1 / Weft 1',
 'Enzyme Washed',NULL,
 'Vila','Core Library','Belgium',60,'300 m',6.20,'EUR',
 ARRAY['OEKO-TEX','Masters of Linen'],0,true,'40°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['Casualwear','Dresses','Shirts'],ARRAY['SS25'],ARRAY['linen','plain','woven','sustainable'],'#d6cab4'),

-- 8
('6201','SLK-CHARMEUSE-01','SLK-CHARMEUSE-01',
 'Woven','Charmeuse','Active',
 '100% Silk','75 g/m²','140 cm',
 'Satin Weave',NULL,'Warp 4 / Weft 1',
 'Sand Washed',NULL,
 'Selected Homme','Premium Library','China',70,'200 m',22.00,'EUR',
 ARRAY['OEKO-TEX'],0,false,'Dry clean only','Not recyclable',
 'Low',NULL,
 ARRAY['Eveningwear','Blouses','Linings'],ARRAY['SS25','FW25'],ARRAY['silk','charmeuse','satin','premium'],'#e8dcc8'),

-- 9
('7001','RCY-PET-FLEECE01','RCY-PET-FLEECE01',
 'Knit','Fleece','Active',
 '100% Recycled Polyester','280 g/m²','150 cm',
 'Fleece','Anti-Pilling',NULL,
 'Brushed',NULL,
 'Only','Sustainable Library','Portugal',55,'500 m',3.60,'EUR',
 ARRAY['GRS','OEKO-TEX'],100,true,'40°C machine wash','Recyclable',
 'Low',NULL,
 ARRAY['Outerwear','Casualwear','Activewear'],ARRAY['FW25'],ARRAY['recycled','polyester','fleece','sustainable'],'#c0c8d0'),

-- 10
('7002','RCY-NYL-SWIM01','RCY-NYL-SWIM01',
 'Knit','Swimwear','Active',
 '78% Recycled Nylon, 22% Elastane','190 g/m²','155 cm',
 'Circular Knit','Chlorine Resistant',NULL,
 'Printed',NULL,
 'Only','Sustainable Library','Italy',65,'300 m',9.20,'EUR',
 ARRAY['GRS','bluesign'],78,true,'Cold rinse','Recyclable',
 'Low',NULL,
 ARRAY['Swimwear','Activewear'],ARRAY['SS25'],ARRAY['recycled','nylon','swimwear','econyl','sustainable'],'#4a7c9e'),

-- 11
('8001','COT-DENIM-STR01','COT-DENIM-STR01',
 'Woven','Denim','Active',
 '98% Cotton, 2% Elastane','320 g/m²','152 cm',
 'Twill Weave','Stretch',NULL,
 'Stone Washed','Yarn Dyed',
 'Jack & Jones','Denim Library','Pakistan',55,'500 m',5.80,'EUR',
 ARRAY['OEKO-TEX'],0,false,'40°C machine wash inside out','Recyclable',
 'Low',NULL,
 ARRAY['Denim','Casualwear','Jeans'],ARRAY['SS25','FW25'],ARRAY['cotton','denim','stretch','twill'],'#3d5a80'),

-- 12
('8002','COT-DENIM-RAW01','COT-DENIM-RAW01',
 'Woven','Denim','Active',
 '100% Cotton','420 g/m²','152 cm',
 'Twill 3/1','Selvedge',NULL,
 'Raw Denim','Warp Yarn Dyed',
 'Jack & Jones','Denim Library','Japan',90,'200 m',18.00,'EUR',
 ARRAY['OEKO-TEX'],0,false,'Cold wash, hang dry','Recyclable',
 'Low',NULL,
 ARRAY['Premium Denim','Casualwear'],ARRAY['FW25'],ARRAY['cotton','denim','selvedge','raw','premium'],'#1a2e45'),

-- 13
('9001','VIS-CREPE-EV01','VIS-CREPE-EV01',
 'Woven','Crepe','Active',
 '100% ECOVERO Viscose','110 g/m²','145 cm',
 'Crepe Weave',NULL,NULL,
 'Crinkle','Piece Dyed',
 'Vero Moda','Sustainable Library','Austria',60,'400 m',4.40,'EUR',
 ARRAY['ECOVERO','OEKO-TEX'],0,true,'30°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['Dresses','Blouses','Tops'],ARRAY['SS25'],ARRAY['viscose','ecovero','crepe','sustainable'],'#d4bfa0'),

-- 14
('9002','VIS-TWILL-PRIN01','VIS-TWILL-PRIN01',
 'Woven','Twill','Active',
 '100% Viscose','135 g/m²','145 cm',
 'Twill Weave',NULL,'Warp 3 / Weft 1',
 'Digital Print','Piece Dyed',
 'Vila','Core Library','India',50,'500 m',3.20,'EUR',
 ARRAY['OEKO-TEX'],0,false,'30°C gentle wash','Compostable',
 'Low',NULL,
 ARRAY['Dresses','Skirts','Tops'],ARRAY['SS25'],ARRAY['viscose','twill','print'],'#e0b490'),

-- 15
('10001','TNL-PONTE-VIS01','TNL-PONTE-VIS01',
 'Knit','Ponte','Active',
 '60% Viscose, 35% Nylon, 5% Elastane','250 g/m²','150 cm',
 'Double Knit',NULL,NULL,
 'Smooth','Piece Dyed',
 'Pieces','Core Library','Turkey',50,'300 m',5.50,'EUR',
 ARRAY['OEKO-TEX'],0,false,'30°C machine wash','Not recyclable',
 'Low',NULL,
 ARRAY['Tailoring','Casualwear','Dresses'],ARRAY['SS25','FW25'],ARRAY['viscose','nylon','elastane','ponte','knit'],'#9090a0'),

-- 16
('10002','TNL-INTERLOCK-C01','TNL-INTERLOCK-C01',
 'Knit','Interlock','Active',
 '100% Organic Cotton','220 g/m²','160 cm',
 'Interlock Knit',NULL,NULL,
 'Soft Handle','Piece Dyed',
 'Vila','Sustainable Library','Turkey',45,'400 m',5.90,'EUR',
 ARRAY['GOTS','OEKO-TEX'],0,true,'40°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['T-Shirts','Base Layers','Childrenswear'],ARRAY['SS25','FW25'],ARRAY['organic','cotton','interlock','sustainable'],'#f0ece4'),

-- 17
('11001','SYN-SOFTSHELL-01','SYN-SOFTSHELL-01',
 'Technical','Softshell','Active',
 '92% Polyester, 8% Elastane','320 g/m²','150 cm',
 '3-Layer Bonded','Wind Resistant, Water Repellent',NULL,
 'DWR','Yarn Dyed',
 'Jack & Jones','Technical Library','Taiwan',60,'300 m',11.50,'EUR',
 ARRAY['bluesign'],0,false,'30°C machine wash','Not recyclable',
 'Low',NULL,
 ARRAY['Outerwear','Activewear','Sportswear'],ARRAY['FW25'],ARRAY['polyester','elastane','softshell','technical'],'#4a6070'),

-- 18
('11002','SYN-MEMBRANE-01','SYN-MEMBRANE-01',
 'Technical','Membrane','Active',
 '100% Polyester + ePTFE Membrane','180 g/m²','148 cm',
 '2.5-Layer Laminate','Waterproof 20,000 mm',NULL,
 'DWR','Yarn Dyed',
 'Jack & Jones','Technical Library','Taiwan',75,'200 m',28.00,'EUR',
 ARRAY['bluesign'],0,false,'30°C machine wash','Not recyclable',
 'Low',NULL,
 ARRAY['Outerwear','Rain Gear','Performance Jackets'],ARRAY['FW25'],ARRAY['polyester','membrane','waterproof','technical'],'#2a3840'),

-- 19
('12001','CTN-POPLIN-ORG01','CTN-POPLIN-ORG01',
 'Woven','Poplin','Active',
 '100% Organic Cotton','110 g/m²','145 cm',
 'Plain Weave',NULL,'Warp 1 / Weft 1',
 'Mercerised','Yarn Dyed',
 'Vila','Sustainable Library','India',50,'500 m',3.80,'EUR',
 ARRAY['GOTS','OEKO-TEX'],0,true,'40°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['Shirts','Dresses','Trousers'],ARRAY['SS25'],ARRAY['organic','cotton','poplin','sustainable'],'#f4f0e8'),

-- 20
('12002','CTN-CANVAS-HVY01','CTN-CANVAS-HVY01',
 'Woven','Canvas','Active',
 '100% Cotton','480 g/m²','152 cm',
 'Plain Weave','Waxed',NULL,
 'Wax Finish','Piece Dyed',
 'Selected Homme','Core Library','UK',60,'300 m',8.90,'EUR',
 ARRAY['OEKO-TEX'],0,false,'Wipe clean only','Not recyclable',
 'Low',NULL,
 ARRAY['Workwear','Bags','Accessories','Outerwear'],ARRAY['FW25'],ARRAY['cotton','canvas','waxed','heavy'],'#7a6e60'),

-- 21
('13001','MIX-BOUCLE-WO01','MIX-BOUCLE-WO01',
 'Woven','Bouclé','Active',
 '55% Wool, 30% Acrylic, 15% Polyester','380 g/m²','140 cm',
 'Bouclé Weave',NULL,NULL,
 'Unfinished','Piece Dyed',
 'Selected Homme','Premium Library','Italy',85,'200 m',24.00,'EUR',
 ARRAY['OEKO-TEX'],0,false,'Dry clean only','Not recyclable',
 'Low',NULL,
 ARRAY['Coats','Jackets','Tailoring'],ARRAY['FW25'],ARRAY['wool','acrylic','boucle','premium'],'#c8b89a'),

-- 22
('13002','MIX-TWEED-WO01','MIX-TWEED-WO01',
 'Woven','Tweed','Active',
 '70% Wool, 20% Alpaca, 10% Silk','420 g/m²','142 cm',
 'Twill Weave','Harris-style',NULL,
 'Natural','Yarn Dyed',
 'Selected Homme','Premium Library','UK',90,'100 m',38.50,'EUR',
 ARRAY['RWS'],0,true,'Dry clean only','Compostable',
 'Low',NULL,
 ARRAY['Coats','Jackets','Premium Tailoring'],ARRAY['FW25'],ARRAY['wool','alpaca','silk','tweed','premium','sustainable'],'#8a7060'),

-- 23
('14001','ACC-LINING-VIS01','ACC-LINING-VIS01',
 'Woven','Lining','Active',
 '100% Viscose','65 g/m²','140 cm',
 'Satin Weave',NULL,NULL,
 'Smooth',NULL,
 'Mamalicious','Lining Library','China',40,'1000 m',1.20,'EUR',
 ARRAY['OEKO-TEX'],0,false,'30°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['Linings','Coats','Jackets'],ARRAY['SS25','FW25'],ARRAY['viscose','lining','satin'],'#e8e0d0'),

-- 24
('14002','ACC-LINING-RCY01','ACC-LINING-RCY01',
 'Woven','Lining','Active',
 '100% Recycled Polyester','70 g/m²','150 cm',
 'Plain Weave',NULL,NULL,
 'Smooth',NULL,
 'Noisy May','Sustainable Library','China',40,'1000 m',1.40,'EUR',
 ARRAY['GRS','OEKO-TEX'],100,true,'40°C machine wash','Recyclable',
 'Low',NULL,
 ARRAY['Linings','Coats','Jackets'],ARRAY['SS25','FW25'],ARRAY['recycled','polyester','lining','sustainable'],'#d8d4cc'),

-- 25
('15001','FIL-DOWN-RDS01','FIL-DOWN-RDS01',
 'Filling','Down','Active',
 '90% Duck Down, 10% Duck Feather','N/A','N/A',
 'Loose Fill',NULL,NULL,
 NULL,NULL,
 'Jack & Jones','Filling Library','Poland',60,'100 kg',18.00,'EUR',
 ARRAY['RDS'],0,false,'Specialist down wash','Not recyclable',
 'High','Animal-derived — RDS certification required. Do not use without approval.',
 ARRAY['Puffer Jackets','Sleeping Bags','Quilted Outerwear'],ARRAY['FW25'],ARRAY['down','filling','rds','animal'],'#f0ece4'),

-- 26
('15002','FIL-SYN-THERM01','FIL-SYN-THERM01',
 'Filling','Synthetic Thermal','Active',
 '100% Recycled Polyester','150 g/m²','200 cm',
 NULL,'Siliconized',NULL,
 NULL,NULL,
 'Only','Filling Library','China',50,'500 m',2.80,'EUR',
 ARRAY['GRS'],100,true,'40°C machine wash','Recyclable',
 'Low',NULL,
 ARRAY['Puffer Jackets','Quilted Outerwear'],ARRAY['FW25'],ARRAY['recycled','polyester','filling','thermal','sustainable'],'#dcdcd8'),

-- 27
('16001','STR-ELASTIC-NY01','STR-ELASTIC-NY01',
 'Knit','Elastic Knit','Active',
 '70% Nylon, 30% Elastane','220 g/m²','160 cm',
 'Circular Knit','High Stretch',NULL,
 'Smooth','Piece Dyed',
 'Jack & Jones','Activewear Library','Italy',55,'300 m',7.20,'EUR',
 ARRAY['bluesign','OEKO-TEX'],0,false,'30°C machine wash','Not recyclable',
 'Low',NULL,
 ARRAY['Activewear','Swimwear','Sportswear'],ARRAY['SS25','FW25'],ARRAY['nylon','elastane','stretch','activewear'],'#606878'),

-- 28
('16002','STR-VELVET-CTN01','STR-VELVET-CTN01',
 'Knit','Velvet','Active',
 '85% Cotton, 15% Elastane','320 g/m²','148 cm',
 'Warp Knit Velvet',NULL,NULL,
 'Crushed','Piece Dyed',
 'Selected Homme','Premium Library','Italy',70,'200 m',12.00,'EUR',
 ARRAY['OEKO-TEX'],0,false,'30°C delicate wash','Not recyclable',
 'Low',NULL,
 ARRAY['Eveningwear','Tailoring','Tops'],ARRAY['FW25'],ARRAY['cotton','elastane','velvet','premium'],'#4a2858'),

-- 29
('17001','ECO-TENCEL-LY01','ECO-TENCEL-LY01',
 'Woven','Plain Weave','Active',
 '100% TENCEL Lyocell','130 g/m²','145 cm',
 'Plain Weave',NULL,'Warp 1 / Weft 1',
 'Enzyme Washed',NULL,
 'Object','Sustainable Library','Austria',55,'500 m',5.10,'EUR',
 ARRAY['FSC','OEKO-TEX','TENCEL'],0,true,'30°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['Dresses','Tops','Casualwear'],ARRAY['SS25'],ARRAY['tencel','lyocell','sustainable','lenzing'],'#dce8e0'),

-- 30
('17002','ECO-TENCEL-DENIM01','ECO-TENCEL-DENIM01',
 'Woven','Denim','Active',
 '70% TENCEL Lyocell, 28% Cotton, 2% Elastane','290 g/m²','150 cm',
 'Twill Weave','Stretch Denim',NULL,
 'Stone Washed','Warp Yarn Dyed',
 'Only','Sustainable Library','Austria',65,'300 m',8.60,'EUR',
 ARRAY['TENCEL','OEKO-TEX'],0,true,'30°C machine wash inside out','Compostable',
 'Low',NULL,
 ARRAY['Denim','Casual Trousers','Skirts'],ARRAY['SS25'],ARRAY['tencel','lyocell','cotton','denim','sustainable'],'#4060a0'),

-- 31
('18001','FUR-FAUX-ACR01','FUR-FAUX-ACR01',
 'Non-Woven','Faux Fur','Active',
 '80% Acrylic, 20% Polyester','650 g/m²','150 cm',
 'Pile Fabric','Long Hair',NULL,
 'Natural Finish','Piece Dyed',
 'Jack & Jones','Trend Library','China',60,'200 m',14.00,'EUR',
 ARRAY['OEKO-TEX'],0,false,'30°C gentle wash','Not recyclable',
 'Low',NULL,
 ARRAY['Coats','Accessories','Collar Trim'],ARRAY['FW25'],ARRAY['acrylic','polyester','faux fur','pile'],'#e8d8c0'),

-- 32
('18002','FUR-SHERPA-RCY01','FUR-SHERPA-RCY01',
 'Non-Woven','Sherpa','Active',
 '100% Recycled Polyester','480 g/m²','150 cm',
 'Knitted Pile',NULL,NULL,
 'Sherpa Finish','Yarn Dyed',
 'Pieces','Sustainable Library','China',55,'300 m',8.50,'EUR',
 ARRAY['GRS','OEKO-TEX'],100,true,'30°C gentle wash','Recyclable',
 'Low',NULL,
 ARRAY['Outerwear Lining','Casualwear','Accessories'],ARRAY['FW25'],ARRAY['recycled','polyester','sherpa','sustainable'],'#f0e8d8'),

-- 33
('19001','CTN-CORDUROY-01','CTN-CORDUROY-01',
 'Woven','Corduroy','Active',
 '100% Cotton','380 g/m²','148 cm',
 'Cut Pile Weave','14 Wale',NULL,
 'Brushed',NULL,
 'Jack & Jones','Core Library','India',60,'300 m',6.80,'EUR',
 ARRAY['OEKO-TEX'],0,false,'30°C machine wash inside out','Recyclable',
 'Low',NULL,
 ARRAY['Trousers','Jackets','Casualwear'],ARRAY['FW25'],ARRAY['cotton','corduroy','pile','woven'],'#7a5840'),

-- 34
('19002','CTN-SEERSUCKER-01','CTN-SEERSUCKER-01',
 'Woven','Seersucker','Active',
 '100% Cotton','120 g/m²','145 cm',
 'Plain Weave','Seersucker',NULL,
 'Crinkle','Yarn Dyed Stripe',
 'Vila','Core Library','India',50,'500 m',3.40,'EUR',
 ARRAY['OEKO-TEX'],0,false,'40°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['Summer Shirts','Dresses','Casualwear'],ARRAY['SS25'],ARRAY['cotton','seersucker','stripe','summer'],'#c8d8e8'),

-- 35
('20001','LTH-PU-VEGAN01','LTH-PU-VEGAN01',
 'Leather','PU Vegan Leather','Active',
 'PU Coated Woven Base (100% Polyester)','480 g/m²','140 cm',
 'Coated Woven',NULL,NULL,
 'Embossed','N/A',
 'Selected Homme','Vegan Library','South Korea',55,'200 m',16.00,'EUR',
 ARRAY['OEKO-TEX'],0,false,'Wipe clean','Not recyclable',
 'Low',NULL,
 ARRAY['Bags','Shoes','Accessories','Outerwear'],ARRAY['SS25','FW25'],ARRAY['vegan','pu','leather-look','polyester'],'#2a2520'),

-- 36
('20002','LTH-SUEDE-MICRO01','LTH-SUEDE-MICRO01',
 'Non-Woven','Microsuede','Active',
 '80% Polyester, 20% Nylon','320 g/m²','150 cm',
 'Non-Woven Microfibre','Suede-effect',NULL,
 'Brushed',NULL,
 'Jack & Jones','Technical Library','South Korea',55,'300 m',9.80,'EUR',
 ARRAY['OEKO-TEX'],0,false,'30°C delicate wash','Not recyclable',
 'Low',NULL,
 ARRAY['Bags','Shoes','Accessories','Upholstery'],ARRAY['SS25','FW25'],ARRAY['polyester','nylon','microsuede','suede-effect'],'#8a6858'),

-- 37
('21001','KNT-RIB-CTN01','KNT-RIB-CTN01',
 'Knit','Rib','Active',
 '95% Cotton, 5% Elastane','260 g/m²','100 cm',
 'Rib Knit 1x1',NULL,NULL,
 NULL,'Piece Dyed',
 'Vila','Core Library','Turkey',45,'500 m',3.90,'EUR',
 ARRAY['OEKO-TEX'],0,false,'40°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['Trims','Cuffs','Waistbands','T-Shirts'],ARRAY['SS25','FW25'],ARRAY['cotton','elastane','rib','knit'],'#e8e0d8'),

-- 38
('21002','KNT-WAFFLE-CTN01','KNT-WAFFLE-CTN01',
 'Knit','Waffle','Active',
 '100% Cotton','240 g/m²','160 cm',
 'Waffle Knit',NULL,NULL,
 'Enzyme Wash','Piece Dyed',
 'Vila','Core Library','Turkey',50,'400 m',5.20,'EUR',
 ARRAY['OEKO-TEX'],0,false,'40°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['T-Shirts','Underwear','Casualwear'],ARRAY['SS25','FW25'],ARRAY['cotton','waffle','knit','texture'],'#f0e8d8'),

-- 39
('22001','WVN-JACQUARD-SI01','WVN-JACQUARD-SI01',
 'Woven','Jacquard','Active',
 '55% Silk, 45% Polyester','210 g/m²','140 cm',
 'Jacquard Weave','Damask Pattern',NULL,
 NULL,'Yarn Dyed',
 'Selected Homme','Premium Library','China',80,'200 m',31.00,'EUR',
 ARRAY['OEKO-TEX'],0,false,'Dry clean only','Not recyclable',
 'Low',NULL,
 ARRAY['Eveningwear','Blazers','Premium Tailoring'],ARRAY['FW25'],ARRAY['silk','polyester','jacquard','premium'],'#d4b060'),

-- 40
('22002','WVN-DOBBY-CTN01','WVN-DOBBY-CTN01',
 'Woven','Dobby','Active',
 '100% Cotton','155 g/m²','145 cm',
 'Dobby Weave','Geometric Pattern',NULL,
 'Easy Care',NULL,
 'Name It','Core Library','India',50,'500 m',4.10,'EUR',
 ARRAY['OEKO-TEX'],0,false,'40°C machine wash','Compostable',
 'Low',NULL,
 ARRAY['Shirts','Dresses','Blouses'],ARRAY['SS25'],ARRAY['cotton','dobby','pattern','woven'],'#e8e4dc');
