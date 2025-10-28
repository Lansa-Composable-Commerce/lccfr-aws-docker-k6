import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/actions/deleleSession";

export async function POST() {
  deleteSession();

  return NextResponse.json({ success: true });
}
