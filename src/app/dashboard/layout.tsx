import { DashboardSidebar } from "@/components/layout/sidebar";
import { ChatWidget } from "@/components/chat/chat-widget";
import { TelegramProvider } from "@/components/telegram-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TelegramProvider>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-4 pb-24 lg:p-8 lg:pb-8">
          {children}
        </main>
        <ChatWidget />
      </div>
    </TelegramProvider>
  );
}
