import type { UIMessage } from "ai";

export function ChatMessage({ message }: { message: UIMessage }) {
  return (
    <div
      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
        message.role === "user"
          ? "ml-auto bg-emerald-600 text-white"
          : "bg-muted"
      }`}
    >
      {message.parts
        .filter((p) => p.type === "text")
        .map((p, i) => (
          <span key={i}>{p.text}</span>
        ))}
    </div>
  );
}
