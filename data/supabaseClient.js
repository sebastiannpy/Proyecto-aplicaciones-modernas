import { createClient } from '@supabase/supabase-js';
import { ExpressValidator } from 'express-validator';

const supabaseUrl = 'https://amcripliptxcqnipnler.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3JpcGxpcHR4Y3FuaXBubGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NTM3MjAsImV4cCI6MjA4OTUyOTcyMH0.8UdCE1rU5BIIwoNK4dSC-CNuDGa9uWcLP7EcVuG7gnA';

const supabase = createClient(supabaseUrl, supabaseKey);

export const updateProductById = async (id, { name, price, category, brand, stock }) => {

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      price,
      category,
      brand,
      stock
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error en Supabase:", error);
    return null;
  }

  return data.length > 0 ? data[0] : null;
};



export default supabase;