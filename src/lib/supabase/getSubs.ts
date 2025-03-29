import { Session } from "next-auth";
import { createClient } from "./server";
import { Sub } from "@/types/reddit";

export type Supa = {
  data?: Sub[];
  error?: unknown;
};

export async function getSubs(session: Session): Promise<Supa> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reddit_followed")
    .select("sub,img,id")
    .eq("email", session.user?.email);

  if (error) return { error };

  return {
    data: data.map((item) => ({ sub: item.sub, img: item.img, id: item.id })),
  };
}
