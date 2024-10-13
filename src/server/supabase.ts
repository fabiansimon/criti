/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v4 as uuidv4 } from "uuid";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "~/env";

const SUPABASE_BUCKET = env.SUPABASE_BUCKET;
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_KEY;

console.log(SUPABASE_BUCKET, SUPABASE_URL, SUPABASE_KEY);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key");
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function storeFile({
  buffer,
  type,
}: {
  buffer: ArrayBuffer;
  type: string;
}) {
  const fileId = uuidv4();
  const path = `uploads/${fileId}`;
  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(path, buffer, {
      contentType: type,
    });

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }

  const {
    data: { publicUrl: fileUrl },
  } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);

  return { fileUrl };
}
