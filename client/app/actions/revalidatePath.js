"use server";

import { revalidatePath } from "next/cache";

export async function revalidateWithPath(path) {
  revalidatePath(path)
}
