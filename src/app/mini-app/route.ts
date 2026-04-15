import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/supabase-server";

export async function GET(req: NextRequest) {
  // Get counts
  let propCount = 0;
  let leadCount = 0;
  let activeCount = 0;
  let viewingCount = 0;
  let recentLeads: any[] = [];
  let recentProperties: any[] = [];
  let upcomingViewings: any[] = [];

  try {
    const [propRes, leadRes, activeRes, viewingRes, leadsRes, propertiesRes, viewingsRes] = await Promise.all([
      supabase.from("properties").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("viewings").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("viewings").select("*").eq("status", "scheduled").order("scheduled_at", { ascending: true }).limit(5),
    ]);

    propCount = propRes.count ?? 0;
    leadCount = leadRes.count ?? 0;
    activeCount = activeRes.count ?? 0;
    viewingCount = viewingRes.count ?? 0;
    recentLeads = leadsRes.data ?? [];
    recentProperties = propertiesRes.data ?? [];
    upcomingViewings = viewingsRes.data ?? [];
  } catch (e) {
    // DB may not be available
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>TTT Properties Dashboard</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--tg-theme-bg-color, #f5f5f5);
      color: var(--tg-theme-text-color, #1a1a1a);
      padding: 16px;
      padding-bottom: 80px;
    }
    .header { text-align: center; padding: 20px 0; border-bottom: 1px solid var(--tg-theme-secondary-bg-color, #e0e0e0); margin-bottom: 20px; }
    .header h1 { font-size: 20px; font-weight: 700; }
    .header p { font-size: 12px; color: var(--tg-theme-hint-color, #999); margin-top: 4px; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .stat-card { background: var(--tg-theme-secondary-bg-color, #fff); border-radius: 12px; padding: 16px; text-align: center; }
    .stat-card .number { font-size: 28px; font-weight: 700; color: #059669; }
    .stat-card .label { font-size: 11px; color: var(--tg-theme-hint-color, #999); margin-top: 4px; text-transform: uppercase; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
    .item { background: var(--tg-theme-secondary-bg-color, #fff); border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .item .name { font-size: 13px; font-weight: 500; }
    .item .meta { font-size: 11px; color: var(--tg-theme-hint-color, #999); }
    .item .price { font-size: 13px; font-weight: 600; color: #059669; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; }
    .badge-hot { background: #fef2f2; color: #dc2626; }
    .badge-warm { background: #fffbeb; color: #d97706; }
    .badge-cold { background: #f0f9ff; color: #0284c7; }
    .badge-scheduled { background: #f0fdf4; color: #059669; }
    .chat-input { position: fixed; bottom: 0; left: 0; right: 0; background: var(--tg-theme-secondary-bg-color, #fff); padding: 12px 16px; border-top: 1px solid #e0e0e0; display: flex; gap: 8px; }
    .chat-input input { flex: 1; border: 1px solid #e0e0e0; border-radius: 20px; padding: 10px 16px; font-size: 14px; outline: none; background: var(--tg-theme-bg-color, #f5f5f5); color: var(--tg-theme-text-color, #1a1a1a); }
    .chat-input button { background: #059669; color: white; border: none; border-radius: 20px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .empty { text-align: center; padding: 20px; color: var(--tg-theme-hint-color, #999); font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>TTT Properties</h1>
    <p>Your real estate dashboard</p>
  </div>

  <div class="stats">
    <div class="stat-card"><div class="number">${propCount}</div><div class="label">Properties</div></div>
    <div class="stat-card"><div class="number">${leadCount}</div><div class="label">Leads</div></div>
    <div class="stat-card"><div class="number">${activeCount}</div><div class="label">Active</div></div>
    <div class="stat-card"><div class="number">${viewingCount}</div><div class="label">Viewings</div></div>
  </div>

  <div class="section">
    <div class="section-title">📅 Upcoming Viewings</div>
    ${upcomingViewings.length ? upcomingViewings.map(v => `
      <div class="item">
        <div>
          <div class="name">Viewing</div>
          <div class="meta">${new Date(v.scheduled_at).toLocaleDateString()}</div>
        </div>
        <span class="badge badge-scheduled">${v.status}</span>
      </div>
    `).join('') : '<div class="empty">No upcoming viewings</div>'}
  </div>

  <div class="section">
    <div class="section-title">👤 Recent Leads</div>
    ${recentLeads.length ? recentLeads.map(l => `
      <div class="item">
        <div>
          <div class="name">${l.full_name}</div>
          <div class="meta">${l.source || 'website'} · ${l.status}</div>
        </div>
        <span class="badge badge-${l.score || 'cold'}">${l.score || 'cold'}</span>
      </div>
    `).join('') : '<div class="empty">No leads yet -- send details in chat!</div>'}
  </div>

  <div class="section">
    <div class="section-title">🏠 Recent Properties</div>
    ${recentProperties.length ? recentProperties.map(p => `
      <div class="item">
        <div>
          <div class="name">${p.title_en}</div>
          <div class="meta">${p.area_district || ''} · ${p.property_type}</div>
        </div>
        <div class="price">${p.price_thb ? '฿' + Number(p.price_thb).toLocaleString() : 'TBD'}</div>
      </div>
    `).join('') : '<div class="empty">No properties yet -- send details in chat to add one!</div>'}
  </div>

  <div class="chat-input">
    <input type="text" id="msgInput" placeholder="Add property, client, or task..." />
    <button onclick="sendMessage()">Send</button>
  </div>

  <script>
    const tg = window.Telegram?.WebApp;
    if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor('#059669'); }
    function sendMessage() {
      const input = document.getElementById('msgInput');
      const text = input.value.trim();
      if (!text) return;
      if (tg) { tg.sendData(text); }
      input.value = '';
    }
    document.getElementById('msgInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
