import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-emerald-600" />
          <span className="font-bold">PropOS</span>
        </div>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          AI-powered real estate platform for Phuket, Thailand. Villas, condos, and land — with expert local guidance.
        </p>
        <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PropOS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
