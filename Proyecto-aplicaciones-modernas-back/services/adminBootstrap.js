import { createClient } from "@supabase/supabase-js";

async function findUserByEmail(adminClient, email) {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw error;

    const users = data?.users || [];
    const found = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (users.length < perPage) return null;

    page += 1;
  }
}

export async function ensureAdminUser() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Administrador";

  if (!supabaseUrl || !serviceRoleKey || !adminEmail || !adminPassword) {
    console.warn(
      "[admin-bootstrap] Saltado. Define SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL y ADMIN_PASSWORD.",
    );
    return;
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const existing = await findUserByEmail(adminClient, adminEmail);

  if (existing) {
    const { error } = await adminClient.auth.admin.updateUserById(existing.id, {
      app_metadata: { ...(existing.app_metadata || {}), role: "admin" },
      user_metadata: { ...(existing.user_metadata || {}), name: adminName },
    });

    if (error) throw error;
    console.log(`[admin-bootstrap] Usuario admin actualizado: ${adminEmail}`);
    return;
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    app_metadata: { role: "admin" },
    user_metadata: { name: adminName },
  });

  if (error) throw error;
  console.log(`[admin-bootstrap] Usuario admin creado: ${data.user?.email || adminEmail}`);
}
