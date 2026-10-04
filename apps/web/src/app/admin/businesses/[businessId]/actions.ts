"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const shopSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "At least 2 characters")
    .max(80, "At most 80 characters"),
  shopCode: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,20}$/, "3–20 lowercase letters, numbers, or hyphens"),
});

export type ShopFormState = { error: string | null };

export async function createShop(
  businessId: string,
  _prev: ShopFormState,
  formData: FormData,
): Promise<ShopFormState> {
  await requireRole("super_admin");
  if (!z.uuid().safeParse(businessId).success)
    return { error: "Invalid business" };

  const parsed = shopSchema.safeParse({
    name: formData.get("name"),
    shopCode: formData.get("shopCode"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("shops").insert({
    business_id: businessId,
    name: parsed.data.name,
    shop_code: parsed.data.shopCode,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        error: error.message.includes("shop_code")
          ? "This shop code is already taken."
          : "This business already has a shop with that name.",
      };
    }
    return { error: "Could not create the shop. Try again." };
  }

  revalidatePath(`/admin/businesses/${businessId}`);
  revalidatePath("/admin");
  return { error: null };
}

const ownerSchema = z.object({
  displayName: z.string().trim().min(1, 'Enter the owner’s name').max(60, 'At most 60 characters'),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._]{3,30}$/, '3–30 lowercase letters, numbers, dots, or underscores'),
  email: z.email('Enter a valid email'),
  password: z.string().min(12, 'At least 12 characters'),
});

export type OwnerFormState = { error: string | null; success: boolean };

export async function createOwner(
  businessId: string,
  _prev: OwnerFormState,
  formData: FormData,
): Promise<OwnerFormState> {
  await requireRole('super_admin');
  if (!z.uuid().safeParse(businessId).success) return { error: 'Invalid business', success: false };

  const parsed = ownerSchema.safeParse({
    displayName: formData.get('displayName'),
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the details', success: false };
  }
  const { displayName, username, email, password } = parsed.data;

  const admin = createAdminClient();

  const { data, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) {
    return {
      error: authError.code === 'email_exists' ? 'An account with this email already exists.' : 'Could not create the account.',
      success: false,
    };
  }
  const userId = data.user.id;

  const { error: profileError } = await admin.from('profiles').insert({
    id: userId,
    username,
    display_name: displayName,
    must_change_password: true,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(userId);
    return { error: 'Could not create the profile.', success: false };
  }

  const { error: roleError } = await admin.from('user_roles').insert({
    user_id: userId,
    role: 'admin',
    business_id: businessId,
  });
  if (roleError) {
    await admin.from('profiles').delete().eq('id', userId);
    await admin.auth.admin.deleteUser(userId);
    return { error: 'Could not assign the role.', success: false };
  }

  revalidatePath(`/admin/businesses/${businessId}`);
  return { error: null, success: true };
}
