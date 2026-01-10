-- Test kullanıcısı oluşturma scripti
-- Bu scripti Supabase SQL Editor'de çalıştırın

-- 1. Test kullanıcısı oluştur (Supabase Auth tablosuna)
-- Not: Bu işlemi Supabase Dashboard > Authentication > Users kısmından manuel yapmanız gerekiyor
-- Veya aşağıdaki bilgilerle kayıt olun:
-- Email: test@test.com
-- Password: test123456

-- 2. Profil tablosunu kontrol et
SELECT * FROM public.profiles LIMIT 5;

-- 3. Eğer profil tablosu yoksa oluştur
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS (Row Level Security) politikalarını ayarla
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 5. Trigger oluştur (yeni kullanıcı kaydında otomatik profil oluşturma)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı bağla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
