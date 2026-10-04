"use server";

import { Constants } from "@keralabooks/db-types";
import { toPaise } from "@keralabooks/domain/money";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter the item name")
    .max(80, "At most 80 characters"),
  unit: z.enum(Constants.public.Enums.product_unit, "Choose a unit"),
  rate: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a price like 45 or 45.50"),
});

export type ProductFormState = { error: string | null };

export async function createProduct(
  shopId: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireRole("admin");
  if (!z.uuid().safeParse(shopId).success) return { error: "Invalid shop" };

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    unit: formData.get("unit"),
    rate: formData.get("rate"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    shop_id: shopId,
    name: parsed.data.name,
    unit: parsed.data.unit,
    rate_paise: toPaise(parsed.data.rate),
  });

  if (error) {
    if (error.code === "23505")
      return { error: "An item with this name already exists in this shop." };
    if (error.code === "42501") return { error: "Shop not found" };
    return { error: "Could not add the item. Try again." };
  }

  revalidatePath("/s/[shopCode]/items", "page");
  return { error: null };
}
