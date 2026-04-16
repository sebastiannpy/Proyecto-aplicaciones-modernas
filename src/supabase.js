import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amcripliptxcqnipnler.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3JpcGxpcHR4Y3FuaXBubGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTM3MjAsImV4cCI6MjA4OTUyOTcyMH0.8UdCE1rU5BIIwoNK4dSC-CNuDGa9uWcLP7EcVuG7gnA';

export const supabase = createClient(supabaseUrl, supabaseKey);