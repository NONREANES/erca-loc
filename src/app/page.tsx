import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { getSettings } from "@/lib/data";
import { Site } from "@/components/site/Site";
import { Splash, introScript } from "@/components/site/Splash";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  try {
    const s = await getSettings();
    return {
      title: { absolute: `${s.site_name} | ${s.slogan}` },
      description: s.seo_description,
      openGraph: { title: `${s.site_name} | ${s.tagline}`, description: s.seo_description, type: "website", locale: "pt_BR" },
    };
  } catch {
    return {};
  }
}

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <noscript>
        <style>{`.splash{display:none}`}</style>
      </noscript>
      <Splash />
      <Suspense fallback={<div className="min-h-screen bg-navy" />}>
        <Site />
      </Suspense>
    </>
  );
}
