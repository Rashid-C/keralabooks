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
