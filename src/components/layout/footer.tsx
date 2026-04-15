import { Building2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
                T
              </div>
              <span className="text-lg font-bold">TTT Properties</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Your trusted Phuket real estate partner. Villas, condos, and land with expert local guidance in English and Thai.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/properties" className="text-sm text-muted-foreground hover:text-emerald-600">Properties</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-emerald-600">Contact Us</Link>
              <a href="https://t.me/TTT_Properties_Bot" className="text-sm text-muted-foreground hover:text-emerald-600">Telegram Bot</a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Phuket Areas</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Bang Tao", "Surin", "Patong", "Kamala", "Kata", "Rawai", "Cherng Talay", "Nai Harn", "Laguna"].map((area) => (
                <Link
                  key={area}
                  href={`/areas/${area.toLowerCase().replace(" ", "")}`}
                  className="text-xs text-muted-foreground hover:text-emerald-600"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TTT Properties. All rights reserved. | PDPA Compliant
        </div>
      </div>
    </footer>
  );
}
