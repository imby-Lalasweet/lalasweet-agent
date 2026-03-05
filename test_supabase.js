import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://caunywbjnvvmwrniywku.supabase.co';
const supabaseAnonKey = 'sb_publishable_0ANDlKdRNvNtfPXNKYBEFg_gk2iuhMI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
    // Use rpc or raw SQL via supabase
    const { data, error } = await supabase.rpc('exec_sql', {
        query: 'ALTER TABLE rooms ADD COLUMN IF NOT EXISTS fixed_initiative TEXT;'
    });

    if (error) {
        console.log("RPC method not available, trying direct approach...");
        // Try adding via a dummy update to check if column exists
        const { data: testData, error: testError } = await supabase
            .from('rooms')
            .select('fixed_initiative')
            .limit(1);

        if (testError) {
            console.log("Column does not exist yet. Error:", testError.message);
            console.log("\n=== PLEASE RUN THIS SQL IN YOUR SUPABASE DASHBOARD ===");
            console.log("ALTER TABLE rooms ADD COLUMN IF NOT EXISTS fixed_initiative TEXT;");
            console.log("=====================================================\n");
        } else {
            console.log("Column 'fixed_initiative' already exists! No migration needed.");
        }
    } else {
        console.log("Migration successful!", data);
    }
}

runMigration();
