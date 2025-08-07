import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

// Generates a unique, URL-friendly ID for filenames
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: "No filename provided." },
      { status: 400 }
    );
  }

  // Create a unique path for the file
  const uniqueId = nanoid();
  const uniqueFilename = `${uniqueId}-${filename}`;

  // Upload the file to Vercel Blob storage
  const blob = await put(uniqueFilename, request.body, {
    access: "public",
  });

  // Return the blob object which contains the URL
  return NextResponse.json(blob);
}
