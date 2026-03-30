import { NextRequest, NextResponse } from "next/server";
import { mcpTools } from "@/lib/ai/tools";

export async function POST(req: NextRequest) {
  const { toolName, arguments: args } = await req.json();

  const tool = mcpTools[toolName as keyof typeof mcpTools];
  if (!tool) {
    return NextResponse.json({ error: `Unknown tool: ${toolName}` }, { status: 400 });
  }

  try {
    const result = await (tool as { execute: (args: unknown) => Promise<unknown> }).execute(args);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tool execution failed" },
      { status: 500 }
    );
  }
}
