// pages/api/health.js
import { NextResponse } from "next/server";

export async function GET() {
 return new Response(
    JSON.stringify({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_CENEXT_URL: process.env.NEXT_PUBLIC_CENEXT_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_LOCALE: process.env.NEXT_LOCALE,
      NEXT_PUBLIC_BUYER_TYPE: process.env.NEXT_PUBLIC_BUYER_TYPE,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  }
  