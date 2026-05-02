import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : (() => {
        const mockQuery = {
            select: () => mockQuery,
            insert: () => mockQuery,
            update: () => mockQuery,
            upsert: () => mockQuery,
            delete: () => mockQuery,
            eq: () => mockQuery,
            neq: () => mockQuery,
            gt: () => mockQuery,
            lt: () => mockQuery,
            order: () => mockQuery,
            limit: () => mockQuery,
            single: () => mockQuery,
            maybeSingle: () => mockQuery,
            match: () => mockQuery,
            or: () => mockQuery,
            then: (cb: any) => Promise.resolve(cb({ data: [], error: null })),
            catch: () => Promise.resolve({ data: null, error: null }),
        };

        return {
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
                signInWithIdToken: async () => ({ data: { user: null }, error: null }),
                signInWithPassword: async () => ({ data: { user: null }, error: null }),
                signOut: async () => {},
            },
            from: () => mockQuery,
            rpc: () => mockQuery,
        };
    })() as any;
