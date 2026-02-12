/**
 * Seed script to create a test dealer user in Supabase.
 * Run with: node scripts/seed_dealer.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ktgntjgsyqnjzwjtlcsv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z250amdzeXFuanp3anRsY3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MzY1NDEsImV4cCI6MjA4MzUxMjU0MX0.JFqWa6uJ8RZ6QgWKbZbGhwUQK3GN9qW38GEbhjVLoSQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEALER_EMAIL = 'bayi@patidukkan.com';
const DEALER_PASSWORD = 'Bayi2026!';

async function seedDealer() {
    console.log('🚀 Creating test dealer user...');

    // Step 1: Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: DEALER_EMAIL,
        password: DEALER_PASSWORD,
    });

    if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
            console.log('⚠️  User already exists, trying to sign in...');
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: DEALER_EMAIL,
                password: DEALER_PASSWORD,
            });
            if (loginError) {
                console.error('❌ Login failed:', loginError.message);
                return;
            }
            console.log('✅ Signed in as existing user:', loginData.user?.id);
            await createDealerRecord(loginData.user?.id);
            return;
        }
        console.error('❌ Auth Error:', authError.message);
        return;
    }

    const userId = authData.user?.id;
    console.log('✅ User created:', userId);

    // Step 2: Sign in (to get proper session)
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: DEALER_EMAIL,
        password: DEALER_PASSWORD,
    });

    if (loginError) {
        console.log('⚠️  Could not sign in immediately. Email confirmation may be required.');
        console.log('    Try signing in from the app with:');
        console.log(`    Email: ${DEALER_EMAIL}`);
        console.log(`    Password: ${DEALER_PASSWORD}`);
        return;
    }

    await createDealerRecord(loginData.user?.id);
}

async function createDealerRecord(userId) {
    if (!userId) {
        console.error('❌ No user ID provided');
        return;
    }

    // Step 3: Check if dealer record already exists
    const { data: existingDealer } = await supabase
        .from('dealers')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (existingDealer) {
        console.log('⚠️  Dealer record already exists:', existingDealer.company_name);
        console.log('    Status:', existingDealer.status);

        // Update to approved if not already
        if (existingDealer.status !== 'approved') {
            const { error: updateErr } = await supabase
                .from('dealers')
                .update({ status: 'approved' })
                .eq('id', existingDealer.id);

            if (updateErr) {
                console.log('⚠️  Could not auto-approve (RLS). Approve manually from Admin Panel.');
            } else {
                console.log('✅ Status updated to: approved');
            }
        }
        return;
    }

    // Step 4: Create dealer record
    const { data: dealer, error: dealerError } = await supabase
        .from('dealers')
        .insert({
            user_id: userId,
            company_name: 'PatiDükkan Test Bayi',
            tax_number: '1234567890',
            tax_office: 'İstanbul VD',
            company_address: 'Atatürk Cd. No:1, Beşiktaş, İstanbul',
            company_phone: '0212 555 0000',
            city: 'İstanbul',
            district: 'Beşiktaş',
            status: 'pending',
            discount_rate: 15,
            min_order_amount: 500,
        })
        .select()
        .single();

    if (dealerError) {
        console.error('❌ Could not create dealer record:', dealerError.message);
        return;
    }

    console.log('✅ Dealer record created:', dealer.id);
    console.log('   Company:', dealer.company_name);
    console.log('   Status:', dealer.status);

    // Try to auto-approve
    const { error: approveError } = await supabase
        .from('dealers')
        .update({ status: 'approved' })
        .eq('id', dealer.id);

    if (approveError) {
        console.log('⚠️  Could not auto-approve (RLS may block). Approve from Admin Panel → Bayiler tab.');
    } else {
        console.log('✅ Auto-approved!');
    }

    console.log('\n📋 Login Credentials:');
    console.log('   Email:', DEALER_EMAIL);
    console.log('   Password:', DEALER_PASSWORD);
    console.log('   URL: http://localhost:5173/bayi/giris');
}

seedDealer().then(() => {
    console.log('\n🏁 Done.');
    process.exit(0);
}).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
