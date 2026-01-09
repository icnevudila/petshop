import { supabase } from '../supabaseClient';

export interface ContactMessage {
    id?: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    status?: 'new' | 'read' | 'replied';
    created_at?: string;
}

export const sendContactMessage = async (messageData: ContactMessage) => {
    const { data, error } = await supabase
        .from('contact_messages')
        .insert([
            {
                name: messageData.name,
                email: messageData.email,
                subject: messageData.subject,
                message: messageData.message,
                status: 'new'
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error sending contact message:', error);
        throw error;
    }

    return data;
};

export const getContactMessages = async () => {
    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }

    return data;
}

export const updateMessageStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('Error updating status:', error);
        throw error;
    }
}
