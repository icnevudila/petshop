# Supabase Giriş Sorunu Çözümü

## Sorun

Kayıt olduktan sonra giriş yaparken "Invalid login credentials" hatası alınıyor.

## Sebep

Supabase varsayılan olarak **email confirmation** (e-posta doğrulama) gerektirir. Kayıt olduğunuzda Supabase size bir doğrulama e-postası gönderir. Bu e-postadaki linke tıklamadan giriş yapamazsınız.

## Çözüm Seçenekleri

### Seçenek 1: Email Confirmation'ı Kapat (Geliştirme için)

1. Supabase Dashboard'a git: <https://supabase.com/dashboard>
2. Projenizi seçin (ktgntjgsyqnjzwjtlcsv)
3. **Authentication** → **Settings** → **Email Auth**
4. **"Enable email confirmations"** seçeneğini **KAPAT**
5. Kaydet

Artık kayıt olduğunuzda direkt giriş yapabilirsiniz.

### Seçenek 2: Email'i Manuel Onayla

1. Supabase Dashboard → **Authentication** → **Users**
2. Kayıt olduğun kullanıcıyı bul
3. Kullanıcının yanındaki **"..."** menüsüne tıkla
4. **"Confirm email"** seçeneğine tıkla

### Seçenek 3: Test Kullanıcısı Oluştur (Dashboard'dan)

1. Supabase Dashboard → **Authentication** → **Users**
2. **"Add user"** butonuna tıkla
3. Email: <test@test.com>
4. Password: test123456
5. **"Auto Confirm User"** seçeneğini işaretle
6. Create user

## Eksik Tablolar

Konsolda şu tablolar için 404 hatası var:

- `campaigns`
- `blog_posts`

Bu tablolar henüz oluşturulmamış. İsterseniz bu özellikleri şimdilik devre dışı bırakabiliriz veya tabloları oluşturabiliriz.

## Önerilen Aksiyon

Geliştirme aşamasında **Seçenek 1**'i kullan (email confirmation'ı kapat). Production'a geçerken tekrar aç.
