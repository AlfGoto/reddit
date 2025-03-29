"use server";

import { createClient } from "./server";
import { notFound } from "next/navigation";
import { Sub } from "@/types/reddit";
import { revalidatePath } from "next/cache";

export async function removeSub(sub: Sub) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reddit_followed")
    .delete()
    .eq("id", sub.id);

  if (error) notFound();
  revalidatePath("/");
  return;
}
