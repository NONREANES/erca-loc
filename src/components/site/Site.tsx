import { connection } from "next/server";
import { getSiteData } from "@/lib/data";
import { fillTemplate, formatBRL, lines, paragraphs, whatsappLink } from "@/lib/format";
import { Logo, LogoSymbol } from "../Logo";
import {
  IconArrow,
  IconBoxes,
  IconCheck,
  IconClock,
  IconInstagram,
  IconLaptop,
  IconLinkedin,
  IconMail,
  IconMonitor,
  IconPhone,
  IconPin,
  IconShield,
  IconTool,
  IconWhatsApp,
} from "../icons";
import { HeroScene } from "./HeroScene";
import { EntregaAnimada } from "./EntregaAnimada";
import { EquipmentGrid } from "./EquipmentGrid";
import { Header } from "./Header";
import { RevealOnScroll } from "./Reveal";
import { VideoCard } from "./VideoCard";

const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {});

export async function Site() {
  await connection();
  const { settings: s, equipments, categories, banners, videos } = await getSiteData();

  const numero = s.whatsapp_number;
  const wa = (msg: string) => whatsappLink(numero, msg);
  const waGeral = wa(s.msg_default);

  const cards = equipments.map((e) => ({
    ...e,
    waLink: wa(e.whatsappMsg || fillTemplate(s.msg_equipment, { equipamento: e.name })),
  }));

  const comPreco = equipments.find((e) => e.featured && e.priceCents != null) ?? equipments.find((e) => e.priceCents != null);
  const preco = comPreco ? formatBRL(comPreco.priceCents) : "";
  const etapas = lines(s.how_steps).map((l) => {
    const [titulo, ...resto] = l.split("|");
    return { titulo: titulo.trim(), texto: resto.join("|").trim() };
  });

  const stats = [1, 2, 3]
    .map((n) => ({ valor: s[`stat${n}_value`], texto: s[`stat${n}_label`] }))
    .filter((x) => x.valor);

  return (
    <>
      {s.intro_enabled !== "1" && (
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("intro-vista")` }} />
      )}
      <Header whatsapp={waGeral} logoUrl={s.logo_url} cta="WhatsApp" />

      <main>
        {/* ---------------- INÍCIO ---------------- */}
        <section id="inicio" className="relative overflow-hidden bg-navy pb-20 pt-32 text-white lg:pb-28 lg:pt-40">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div className="absolute -right-52 -top-52 h-[46rem] w-[46rem] bg-[radial-gradient(closest-side,rgba(0,180,179,0.16),transparent)]" aria-hidden="true" />
          <div className="absolute -bottom-60 -left-52 h-[40rem] w-[40rem] bg-[radial-gradient(closest-side,rgba(127,214,239,0.10),transparent)]" aria-hidden="true" />
          <svg className="absolute inset-0 hidden h-full w-full opacity-30 md:block" aria-hidden="true">
            <line x1="-5%" y1="85%" x2="105%" y2="20%" stroke="#00B4B3" strokeWidth="1" className="pulso" />
            <line x1="-5%" y1="40%" x2="105%" y2="95%" stroke="#7fd6ef" strokeWidth="1" className="pulso" />
          </svg>

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1fr_1.1fr] lg:px-8">
            <div className="revelar">
              {s.hero_eyebrow && (
                <span className="inline-flex items-center gap-2 rounded-full border border-turquoise/30 bg-turquoise/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky">
                  <span className="h-1.5 w-1.5 rounded-full bg-turquoise" /> {s.hero_eyebrow}
                </span>
              )}
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {s.hero_title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{s.hero_text}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={waGeral}
                  {...ext(waGeral)}
                  className="inline-flex items-center gap-2.5 rounded-full bg-turquoise px-7 py-4 font-semibold text-white shadow-xl shadow-turquoise/30 transition hover:-translate-y-0.5 hover:bg-turquoise-600"
                >
                  <IconWhatsApp className="h-5 w-5" /> {s.hero_cta}
                </a>
                <a
                  href="#equipamentos"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
                >
                  {s.hero_cta2} <IconArrow className="h-4 w-4" />
                </a>
              </div>

              {stats.length > 0 && (
                <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
                  {stats.map((x) => (
                    <div key={x.valor}>
                      <dt className="font-display text-2xl font-extrabold text-turquoise sm:text-3xl">{x.valor}</dt>
                      <dd className="mt-1 text-xs leading-snug text-white/60 sm:text-sm">{x.texto}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div className="revelar" style={{ transitionDelay: "150ms" }}>
              <HeroScene banners={banners} preco={preco} slogan={s.slogan} />
            </div>
          </div>
        </section>

        {/* ---------------- QUEM SOMOS ---------------- */}
        <section id="quem-somos" className="relative py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">
            <div className="revelar relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[2rem] bg-navy p-10 pb-24 text-white shadow-2xl shadow-navy/20 sm:p-12 sm:pb-28">
                <div className="bg-grid absolute inset-0" aria-hidden="true" />
                <LogoSymbol className="absolute -right-10 -top-10 h-56 w-56 opacity-10" />
                <div className="relative">
                  <Logo className="h-11 w-auto" src={s.logo_url || undefined} />
                  <p className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-sky/80">{s.tagline}</p>
                  <div className="mt-10 grid grid-cols-2 gap-4">
                    {[
                      { icone: IconLaptop, t: "Notebooks" },
                      { icone: IconMonitor, t: "Monitores" },
                      { icone: IconPhone, t: "Celulares" },
                      { icone: IconBoxes, t: "Impressoras" },
                    ].map(({ icone: I, t }) => (
                      <div key={t} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-turquoise/15 text-turquoise">
                          <I className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-semibold">{t}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-10 border-t border-white/10 pt-6 font-display text-xl italic text-white/90">“{s.slogan}”</p>
                </div>
              </div>
              {s.stat1_value && (
                <div className="absolute -bottom-8 -right-4 rounded-3xl bg-turquoise px-7 py-5 text-white shadow-xl shadow-turquoise/30 sm:-right-8">
                  <p className="font-display text-4xl font-extrabold">{s.stat1_value}</p>
                  <p className="text-sm text-white/85">{s.stat1_label}</p>
                </div>
              )}
            </div>

            <div className="revelar order-1 lg:order-2">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-turquoise-600">Quem somos</span>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{s.about_title}</h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate">
                {paragraphs(s.about_text).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {lines(s.about_items).map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-navy/8 bg-mist/40 px-4 py-3.5 text-sm font-medium text-navy">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-turquoise text-white">
                      <IconCheck className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- EQUIPAMENTOS ---------------- */}
        <section id="equipamentos" className="bg-mist/60 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="revelar mx-auto mb-12 max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-turquoise-600">Portfólio</span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">{s.equip_title}</h2>
              {s.equip_text && <p className="mt-4 text-lg text-slate">{s.equip_text}</p>}
            </div>
            <div className="revelar">
              <EquipmentGrid items={cards} categories={categories} />
            </div>
            {s.equip_note && <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-slate">* {s.equip_note}</p>}
          </div>
        </section>

        {/* ---------------- COMO FUNCIONA ---------------- */}
        {etapas.length > 0 && (
          <section id="como-funciona" className="relative overflow-hidden py-24 lg:py-32">
            <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
              <div className="revelar">
                <EntregaAnimada />
              </div>
              <div className="revelar">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-turquoise-600">Como funciona</span>
                <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{s.how_title}</h2>
                {s.how_text && <p className="mt-4 text-lg text-slate">{s.how_text}</p>}
                <ol className="relative mt-10 space-y-8">
                  <span className="absolute bottom-6 left-[23px] top-6 w-0.5 bg-mist" aria-hidden="true">
                    <span className="trilha-fill block h-full w-full origin-top bg-gradient-to-b from-[#F7A21B] via-[#2EC4E6] to-[#1E5FD8]" style={{ transformOrigin: "top" }} />
                  </span>
                  {etapas.map((e, k) => (
                    <li key={e.titulo + k} className="relative flex gap-5">
                      <span
                        className="passo-icone relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy font-display text-lg font-extrabold text-white shadow-lg shadow-navy/20"
                        style={{ transitionDelay: `${0.3 + k * 0.25}s` }}
                      >
                        {k + 1}
                      </span>
                      <div className="pt-1">
                        <h3 className="font-display text-lg font-bold text-navy">{e.titulo}</h3>
                        {e.texto && <p className="mt-1 text-slate">{e.texto}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
                <a
                  href={waGeral}
                  {...ext(waGeral)}
                  className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-turquoise px-7 py-3.5 font-semibold text-white shadow-xl shadow-turquoise/25 transition hover:-translate-y-0.5 hover:bg-turquoise-600"
                >
                  <IconWhatsApp className="h-5 w-5" /> {s.hero_cta}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ---------------- INVENTÁRIO + SUPORTE ---------------- */}
        <section className="pb-24 lg:pb-32">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:px-8">
            <article id="inventario" className="revelar relative overflow-hidden rounded-[2rem] bg-navy p-9 text-white sm:p-12">
              <div className="bg-grid absolute inset-0" aria-hidden="true" />
              <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] bg-[radial-gradient(closest-side,rgba(0,180,179,0.22),transparent)]" aria-hidden="true" />
              <div className="relative">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-turquoise/15 text-turquoise">
                  <IconShield className="h-7 w-7" />
                </span>
                <h2 className="mt-6 font-display text-3xl font-extrabold">{s.inventory_title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-white/75">{s.inventory_text}</p>
                <ul className="mt-8 space-y-3">
                  {lines(s.inventory_items).map((i) => (
                    <li key={i} className="flex gap-3 text-white/90">
                      <IconCheck className="mt-1 h-4 w-4 shrink-0 text-turquoise" /> {i}
                    </li>
                  ))}
                </ul>
                <a
                  href={wa(s.msg_inventory)}
                  {...ext(wa(s.msg_inventory))}
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-turquoise px-6 py-3.5 font-semibold text-white transition hover:bg-turquoise-600"
                >
                  <IconWhatsApp className="h-5 w-5" /> {s.inventory_cta}
                </a>
              </div>
            </article>

            <article
              id="suporte"
              className="revelar relative overflow-hidden rounded-[2rem] border border-navy/10 bg-white p-9 sm:p-12"
              style={{ transitionDelay: "120ms" }}
            >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-mist" aria-hidden="true" />
              <div className="relative">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-turquoise">
                  <IconTool className="h-7 w-7" />
                </span>
                <h2 className="mt-6 font-display text-3xl font-extrabold text-navy">{s.support_title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate">{s.support_text}</p>
                <ul className="mt-8 space-y-3">
                  {lines(s.support_items).map((i) => (
                    <li key={i} className="flex gap-3 text-ink/85">
                      <IconCheck className="mt-1 h-4 w-4 shrink-0 text-turquoise" /> {i}
                    </li>
                  ))}
                </ul>
                <a
                  href={wa(s.msg_support)}
                  {...ext(wa(s.msg_support))}
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 font-semibold text-white transition hover:bg-turquoise"
                >
                  <IconWhatsApp className="h-5 w-5" /> {s.support_cta}
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* ---------------- VÍDEOS (só aparece se houver) ---------------- */}
        {videos.length > 0 && (
          <section id="videos" className="relative overflow-hidden bg-navy py-24 lg:py-28">
            <div className="bg-grid absolute inset-0" aria-hidden="true" />
            <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
              <div className="revelar mx-auto mb-12 max-w-2xl text-center">
                <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{s.videos_title}</h2>
                {s.videos_text && <p className="mt-4 text-lg text-white/70">{s.videos_text}</p>}
              </div>
              <div className={`revelar grid gap-8 ${videos.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-4xl"}`}>
                {videos.map((v) => (
                  <VideoCard key={v.id} title={v.title} url={v.url} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- CONTATO ---------------- */}
        <section id="contato" className="pb-24 lg:pb-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="revelar relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-navy via-navy-700 to-[#0a4d68] px-8 py-14 text-white sm:px-14 lg:py-20">
              <div className="bg-grid absolute inset-0" aria-hidden="true" />
              <LogoSymbol className="absolute -right-16 bottom-[-4rem] h-80 w-80 opacity-10" />
              <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
                <div>
                  <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">{s.contact_title}</h2>
                  <p className="mt-5 max-w-xl text-lg text-white/75">{s.contact_text}</p>
                  <a
                    href={waGeral}
                    {...ext(waGeral)}
                    className="mt-9 inline-flex items-center gap-3 rounded-full bg-turquoise px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-turquoise/30 transition hover:-translate-y-0.5 hover:bg-turquoise-600"
                  >
                    <IconWhatsApp className="h-6 w-6" /> {s.contact_cta}
                  </a>
                </div>
                <ul className="space-y-4 text-white/85">
                  {s.contact_phone && (
                    <li className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><IconPhone className="h-5 w-5 text-turquoise" /></span>
                      {s.contact_phone}
                    </li>
                  )}
                  {s.contact_email && (
                    <li className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><IconMail className="h-5 w-5 text-turquoise" /></span>
                      <a href={`mailto:${s.contact_email}`} className="hover:text-white">{s.contact_email}</a>
                    </li>
                  )}
                  {s.contact_address && (
                    <li className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><IconPin className="h-5 w-5 text-turquoise" /></span>
                      {s.contact_address}
                    </li>
                  )}
                  {s.contact_hours && (
                    <li className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><IconClock className="h-5 w-5 text-turquoise" /></span>
                      {s.contact_hours}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- RODAPÉ ---------------- */}
      <footer className="bg-navy-900 text-white/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row lg:px-8">
          <div className="text-center sm:text-left">
            <Logo className="mx-auto h-9 w-auto sm:mx-0" src={s.logo_url || undefined} />
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-sky/60">{s.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-turquoise hover:text-turquoise">
                <IconInstagram className="h-5 w-5" />
              </a>
            )}
            {s.linkedin && (
              <a href={s.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-turquoise hover:text-turquoise">
                <IconLinkedin className="h-5 w-5" />
              </a>
            )}
          </div>
          <p className="text-sm">© {new Date().getFullYear()} {s.site_name}. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Botão flutuante do WhatsApp */}
      <a
        href={waGeral}
        {...ext(waGeral)}
        aria-label="Conversar no WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition hover:scale-110"
      >
        <IconWhatsApp className="h-7 w-7" />
      </a>

      <RevealOnScroll />
    </>
  );
}
