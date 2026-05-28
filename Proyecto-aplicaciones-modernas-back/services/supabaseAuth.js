// services/supabaseAuth.js
// Maneja registro y login con Supabase Auth

import supabase from '../data/supabaseClient.js';

// Registro
export const registerUser = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  if (error) {
    console.error('Error al crear usuario:', error.message);
    return { error: error.message };
  }
  return data;
};

// Login
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    return { error: error.message };
  }
  return data;
};

// Logout
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error.message);
    return false;
  }
  return true;
};