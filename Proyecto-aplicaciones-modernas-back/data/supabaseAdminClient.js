import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://amcripliptxcqnipnler.supabase.co';
const serviceRoleKey = 'sb_secret_zqBNBtF09T2fTqpf7MDwug_CFdt3384';


if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export default supabaseAdmin;
