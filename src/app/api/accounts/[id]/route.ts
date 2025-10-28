import { getAccount } from "@/api/account";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;

  const response = await getAccount(id);

  return NextResponse.json(response);
}
