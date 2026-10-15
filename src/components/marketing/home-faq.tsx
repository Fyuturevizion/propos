import { getTranslations } from "next-intl/server";

type FaqItem = { q: string; a: string };

export async function HomeFaq() {
  const t = await getTranslations("home.faq");
  let items: FaqItem[] = [];
  try {
    items = t.raw("items") as FaqItem[];
  } catch {
    return null;
  }
  if (!items?.length) return null;

  const title = t("title");

  return (
    <section className="px-6 py-20 bg-white" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="text-2xl font-bold text-center">
          {title}
        </h2>
        <dl className="mt-10 space-y-8">
          {items.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-lg">{item.q}</dt>
              <dd className="mt-2 text-muted-foreground leading-relaxed">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
