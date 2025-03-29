import { Session } from "next-auth";
import { createClient } from "./server";

export type Supa = {
  data?: string[];
  error?: unknown;
};

export async function getSubs(session: Session): Promise<Supa> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reddit_followed")
    .select("sub")
    .eq("email", session.user?.email);

  if (error) return { error };

  return { data: data.map((item) => item.sub) };
}
