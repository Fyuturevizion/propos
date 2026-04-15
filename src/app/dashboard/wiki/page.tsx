import { getAgent } from "@/lib/auth";

export default async function WikiPage() {
  const { agent } = await getAgent();
  const firstName = agent.fullName?.split(" ")[0] || "Admin";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">TTT Properties Guide</h1>
        <p className="text-muted-foreground mt-1">
          Everything you need to know, {firstName}. If you still have questions, just ask the bot!
        </p>
      </div>

      {/* Getting Started */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">🚀</span> Getting Started
        </h2>
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">How do I log in?</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Easiest way: open Telegram and send <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/dashboard</code> to the bot.
              It will send you a button that logs you in automatically.
            </p>
            <p className="text-sm text-muted-foreground">
              Or go to the login page and use your email and password.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">How do I add my first property?</h3>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Open Telegram and message the bot</li>
              <li>Type something like: <em>&quot;New villa in Kata, 3 bedrooms, 2 bathrooms, 5.5 million baht, private pool&quot;</em></li>
              <li>The bot will create the listing automatically</li>
              <li>It will appear in your Dashboard → Listings page</li>
            </ol>
          </div>
          <div>
            <h3 className="font-medium mb-2">How do I add a client/lead?</h3>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Tell the bot: <em>&quot;New client Khun Somchai, phone 081-234-5678, looking for a condo in Patong under 3 million&quot;</em></li>
              <li>The bot saves the client AND their requirements</li>
              <li>Check Dashboard → CRM to see them on the board</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Telegram Bot */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">💬</span> Telegram Bot — Your Assistant
        </h2>
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            The bot is like having a smart assistant who never sleeps. Just talk to it naturally — in English, Thai, or both mixed together. It understands you.
          </p>
          <div>
            <h3 className="font-medium mb-2">What can I ask the bot to do?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: "🏠", title: "Add Properties", example: "\"New condo in Patong, 2 bed, 4.2M baht, sea view\"" },
                { icon: "👤", title: "Add Clients", example: "\"New client Khun Mali, phone 092-111-2222, wants villa\"" },
                { icon: "📋", title: "Create Tasks", example: "\"Remind me to call Khun Prasert tomorrow at 2pm\"" },
                { icon: "🔍", title: "Search", example: "\"How many villas do I have in Kata?\"" },
                { icon: "✍️", title: "Draft Messages", example: "\"Write a Thai message about the Bang Tao villa\"" },
                { icon: "📊", title: "Get Status", example: "\"How many leads do I have?\" or /status" },
                { icon: "📅", title: "Schedule", example: "\"Set a viewing for the Kata villa on Friday 3pm\"" },
                { icon: "🌐", title: "Translate", example: "\"Translate this property description to Thai\"" },
              ].map((item) => (
                <div key={item.title} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.example}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Bot Commands</h3>
            <div className="text-sm space-y-1">
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/start</code> — Welcome message</div>
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/help</code> — What can the bot do</div>
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/status</code> — Quick numbers (properties, clients, tasks)</div>
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/properties</code> — See your recent listings</div>
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/clients</code> — See your recent leads</div>
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/tasks</code> — See pending tasks</div>
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/dashboard</code> — Open the full dashboard (logs you in)</div>
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/agent</code> — Send a task to Hermes, the technical AI (admin only)</div>
              <div><code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/taskstatus</code> — Check on a Hermes task</div>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-sm text-emerald-800">
              <strong>💡 Pro tip:</strong> You don&apos;t need to use commands. Just talk to the bot like a friend.
              Say &quot;show me all properties&quot; or &quot;how many leads are hot?&quot; and it will understand.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span> Dashboard Pages
        </h2>
        <div className="bg-white rounded-xl border p-6 space-y-4">
          {[
            {
              title: "Overview",
              desc: "See your numbers at a glance: how many properties, leads, and tasks you have. Plus recent activity.",
              tip: "This is your home base. Check it daily.",
            },
            {
              title: "CRM (Client Board)",
              desc: "All your clients on a Kanban board. Each card shows their name, contact info, budget, and status. Stages: New → Qualified → Viewing → Offer → Negotiation → Won/Lost.",
              tip: "When a client moves to the next stage, you can update their status here.",
            },
            {
              title: "Listings",
              desc: "All your properties in a table. Add new ones here or via the Telegram bot.",
              tip: "Click 'Add New' to create a property through a form, or just tell the bot.",
            },
            {
              title: "Inbox",
              desc: "All messages from all platforms (Telegram, website, email) in one place.",
              tip: "Messages from the bot conversations appear here too.",
            },
            {
              title: "Calendar",
              desc: "Your upcoming property viewings. See when, where, and with whom.",
              tip: "Tell the bot to schedule viewings and they appear here automatically.",
            },
            {
              title: "Settings",
              desc: "Your profile info and a sign out button.",
              tip: "Use the Telegram login so you never need to remember a password.",
            },
          ].map((item) => (
            <div key={item.title} className="border-b last:border-0 pb-4 last:pb-0">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              <p className="text-xs text-emerald-600 mt-1">💡 {item.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">❓</span> Common Questions
        </h2>
        <div className="bg-white rounded-xl border p-6 space-y-4">
          {[
            {
              q: "Can I use the bot in Thai?",
              a: "Yes! Type in Thai and the bot responds in Thai. Mix English and Thai if you want — it understands both perfectly.",
            },
            {
              q: "What if I make a mistake?",
              a: "Just tell the bot. Say \"delete the last property\" or \"change the price to 6 million\" and it will help you fix it. You can also edit things in the dashboard.",
            },
            {
              q: "Can I access the dashboard on my phone?",
              a: "Yes! Send /dashboard to the bot and tap the button. It opens in your phone browser. You can also add it to your home screen as an app.",
            },
            {
              q: "Is my data safe?",
              a: "All data is stored locally on Iain's server. Nothing goes to external cloud services. Your conversations with the bot are private.",
            },
            {
              q: "What if the bot doesn't understand me?",
              a: "Try rephrasing. The bot understands natural language but sometimes needs clearer details. For example, instead of \"add that property\", say \"new villa in Kata, 3 bed, 5 million baht\".",
            },
            {
              q: "How do I see all my pending tasks?",
              a: "Send /tasks to the bot, or check the Overview page in the dashboard.",
            },
          ].map((item, i) => (
            <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
              <h3 className="font-medium">{item.q}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Secret Riddle -- the real easter egg clue */}
      <section className="mb-10">
        <div className="relative overflow-hidden rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
          {/* Sparkle decorations */}
          <div className="absolute top-2 right-4 text-emerald-300 animate-ping text-xs" style={{animationDuration: "3s"}}>&#10022;</div>
          <div className="absolute top-8 right-12 text-emerald-200 animate-ping text-xs" style={{animationDuration: "4s", animationDelay: "1s"}}>&#10022;</div>
          <div className="absolute bottom-4 right-8 text-teal-300 animate-ping text-xs" style={{animationDuration: "5s", animationDelay: "2s"}}>&#10022;</div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl">
              🔮
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-800 mb-2">
                A Secret From Iain
              </h2>
              <div className="space-y-3 text-sm text-emerald-700">
                <p className="italic">
                  &quot;I built something hidden in this app. Only someone who truly explores
                  will find it. Here is your riddle:&quot;
                </p>
                <div className="bg-white/80 rounded-lg p-4 border border-emerald-200">
                  <p className="font-mono text-emerald-900 leading-relaxed">
                    I have pages but I am not a book.<br/>
                    I have a heart that is green.<br/>
                    Tap me five times and take a look<br/>
                    At something you have never seen.<br/><br/>
                    <span className="text-emerald-500">Where to look:</span> Go to Settings.<br/>
                    <span className="text-emerald-500">What to tap:</span> The green T in the sidebar.
                  </p>
                </div>
                <p className="text-xs text-emerald-600">
                  Hint: The sidebar is on the left. The green T is at the top. Tap it 5 times fast.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-muted-foreground border-t">
        <p>TTT Properties — Phuket Real Estate Operating System</p>
        <p className="mt-1">Built with ❤️ by Iain for Bow</p>
        <p className="mt-2 text-xs">Questions? Just ask the Telegram bot. It knows everything about this system.</p>
      </div>
    </div>
  );
}
