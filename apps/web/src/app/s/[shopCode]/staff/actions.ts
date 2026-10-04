"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { serverEnv } from "@/env.server";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const staffSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Enter the staff member’s name")
    .max(60, "At most 60 characters"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9._]{3,30}$/,
      "3–30 lowercase letters, numbers, dots, or underscores",
    ),
  password: z
    .string()
    .min(12, "At least 12 characters")
    .max(72, "At most 72 characters"),
});

export type StaffFormState = { error: string | null; success: boolean };

export async function createStaff(
  shopId: string,
  _prev: StaffFormState,
  formData: FormData,
): Promise<StaffFormState> {
  const user = await requireRole("super_admin", "admin");
  if (!z.uuid().safeParse(shopId).success)
    return { error: "Invalid shop", success: false };

  const supabase = await createClient();
  const { data: shop } = await supabase
    .from("shops")
    .select("id, business_id, shop_code")
    .eq("id", shopId)
    .maybeSingle();
  if (
    !shop ||
    (user.role === "admin" && shop.business_id !== user.businessId)
  ) {
    return { error: "Shop not found", success: false };
  }

  const parsed = staffSchema.safeParse({
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the details",
      success: false,
    };
  }
  const { displayName, username, password } = parsed.data;

  const email = `${username}@${shop.shop_code}.${serverEnv.STAFF_LOGIN_DOMAIN}`;
  const admin = createAdminClient();

  const { data, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) {
    return {
      error:
        authError.code === "email_exists"
          ? "This username is already taken in this shop."
          : "Could not create the account.",
      success: false,
    };
  }
  const userId = data.user.id;

  const { error: profileError } = await admin.from("profiles").insert({
    id: userId,
    username,
    display_name: displayName,
    must_change_password: true,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(userId);
    return { error: "Could not create the profile.", success: false };
  }

  const { error: roleError } = await admin.from("user_roles").insert({
    user_id: userId,
    role: "employee",
    business_id: shop.business_id,
    shop_id: shop.id,
  });
  if (roleError) {
    await admin.from("profiles").delete().eq("id", userId);
    await admin.auth.admin.deleteUser(userId);
    return { error: "Could not assign the role.", success: false };
  }

  revalidatePath("/s/[shopCode]/staff", "page");
  return { error: null, success: true };
}
