import { Building2, Plus, Search } from "lucide-react";

export default function ListingsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="mt-1 text-muted-foreground">Manage your property inventory</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          <Plus className="h-4 w-4" /> Add Property
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search listings..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <select className="rounded-md border px-3 py-2 text-sm">
          <option>All Types</option>
          <option>Villa</option>
          <option>Condo</option>
          <option>Land</option>
        </select>
        <select className="rounded-md border px-3 py-2 text-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Sold</option>
        </select>
      </div>

      <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed py-16 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/30" />
        <h3 className="mt-4 text-lg font-medium">No listings yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Add your first property to get started. Listings will auto-publish to the website.
        </p>
      </div>
    </div>
  );
}
