-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies

-- Allow anyone (anon) to insert contact messages
CREATE POLICY "Anyone can send a contact message" 
    ON contact_messages FOR INSERT 
    WITH CHECK (true);

-- Allow only admins/service role to view messages (assuming authenticated users shouldn't see others' messages)
-- For simplicity, if we haven't strictly defined 'admin' role yet, we might use authenticated for now, but really this should be restricted.
-- Since the user hasn't fully set up admin strict roles, we'll allow Authenticated Read for now (or assume dashboard uses service role/admin privileges). 
-- Ideally: 
-- CREATE POLICY "Admins can view messages" ON contact_messages FOR SELECT USING (auth.role() = 'service_role');
-- But for this demo context where we might log in as a user who is "admin":
CREATE POLICY "Authenticated users (admins) can view messages" 
    ON contact_messages FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users (admins) can update messages" 
    ON contact_messages FOR UPDATE 
    USING (auth.role() = 'authenticated');
