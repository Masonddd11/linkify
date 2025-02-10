import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {

  const { username } = await params;
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch GitHub contributions");
    }

    const data = await response.json();
    console.log('GitHub API Response:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return new NextResponse("Failed to fetch contributions", { status: 500 });
  }
} 