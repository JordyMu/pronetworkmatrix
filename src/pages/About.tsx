import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";
import RegistrationModal from "@/components/RegistrationModal";
import { RegistrationProvider, useRegistration } from "@/contexts/RegistrationContext";
import { Users, Coins, Share2, ShieldCheck, HeartHandshake, AlertTriangle } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gradient-gold mb-5">{title}</h2>
    <div className="space-y-4 text-foreground/80 leading-relaxed">{children}</div>
  </section>
);

const Item = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card/50 p-5">
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-foreground/75">{children}</p>
  </div>
);

const AboutContent = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isOpen, closeRegistration, openRegistration } = useRegistration();

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="À propos de ProNetwork — Revenu Communautaire"
        description="Découvrez le modèle de revenu communautaire de ProNetwork : fonctionnement, exemples de coopératives, avantages et enjeux de la mise en commun des ressources."
        path="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Plateforme de Revenu Communautaire",
          about: "Modèle de revenu communautaire et coopératives de services",
          inLanguage: "fr",
          publisher: { "@type": "Organization", name: "ProNetwork" },
          mainEntityOfPage: "https://pronetworkmatrix.lovable.app/about",
        }}
      />
      <Navbar onLoginClick={() => setLoginOpen(true)} />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="text-center mb-14">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gradient-gold mb-5">
              Plateforme de Revenu Communautaire
            </h1>
            <p className="text-foreground/70 text-lg">
              Une plateforme de revenu communautaire est un modèle économique et numérique où les
              membres d'une communauté génèrent, partagent ou redistribuent des revenus de manière
              collective. Contrairement aux modèles économiques traditionnels basés sur
              l'individualisme, ces plateformes reposent sur la solidarité, la collaboration et la
              mutualisation des ressources.
            </p>
          </header>

          <Section title="1. Fonctionnement Principal">
            <div className="grid gap-4 md:grid-cols-3">
              <Item title="Mutualisation des ressources">
                Les participants mettent en commun des fonds, des compétences, du temps ou des
                actifs (par exemple, des espaces, du matériel ou du contenu créatif).
              </Item>
              <Item title="Redistribution équitable">
                Les gains générés par l'activité collective sont redistribués aux membres selon des
                règles établies par la communauté (souvent proportionnellement à l'implication, à
                parts égales, ou sous forme de fonds de soutien mutuel).
              </Item>
              <Item title="Gouvernance partagée">
                Les décisions concernant la gestion des fonds ou les projets à financer sont
                généralement prises collectivement, parfois via des outils technologiques comme la
                blockchain ou des applications de vote communautaire.
              </Item>
            </div>
          </Section>

          <Section title="2. Principaux Modèles et Exemples">
            <p>Ces plateformes prennent plusieurs formes selon le secteur d'activité :</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Item title="Financement participatif récurrent">
                Des créateurs, artistes ou entrepreneurs reçoivent un soutien financier régulier de
                leur communauté en échange de contenus exclusifs ou d'un accès privilégié.
              </Item>
              <Item title="Coopératives de travail et plateformes de services">
                Des travailleurs unissent leurs forces pour proposer des services (livraison,
                transport, services numériques) en éliminant les commissions des intermédiaires
                traditionnels, pour que l'intégralité ou la quasi-totalité des revenus revienne aux
                prestataires.
              </Item>
              <Item title="Revenu de base communautaire">
                Des communautés en ligne ou locales créent un fonds rotatif ou alimenté par des
                dons/activités pour verser un soutien financier de base à leurs membres dans le
                besoin.
              </Item>
              <Item title="Économie circulaire et de partage">
                Des plateformes où les membres louent ou échangent des biens entre eux, générant un
                complément de revenu local et solidaire.
              </Item>
            </div>
          </Section>

          <Section title="3. Avantages et Enjeux">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-primary/30 bg-card/50 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                  <HeartHandshake className="h-5 w-5 text-primary" /> Avantages
                </h3>
                <ul className="space-y-2 list-disc list-inside text-foreground/75">
                  <li>Réduction de la précarité grâce au soutien mutuel.</li>
                  <li>Renforcement du lien social et de l'appartenance à un groupe.</li>
                  <li>Élimination des intermédiaires gourmands en frais.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                  <AlertTriangle className="h-5 w-5 text-primary" /> Enjeux et Défis
                </h3>
                <ul className="space-y-2 list-disc list-inside text-foreground/75">
                  <li>Nécessité d'une confiance mutuelle forte et d'une transparence totale.</li>
                  <li>
                    Complexité de la gestion administrative et juridique (conformité fiscale,
                    régulation des flux financiers).
                  </li>
                  <li>Risques de désaccord sur la répartition des revenus.</li>
                </ul>
              </div>
            </div>
          </Section>

          <div className="flex flex-wrap justify-center gap-6 text-primary/80 pt-4">
            <Users className="h-6 w-6" />
            <Coins className="h-6 w-6" />
            <Share2 className="h-6 w-6" />
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </main>

      <Footer />
      <RegistrationModal
        open={isOpen}
        onOpenChange={closeRegistration}
        onSwitchToLogin={() => {
          closeRegistration();
          setLoginOpen(true);
        }}
      />
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          openRegistration();
        }}
      />
    </div>
  );
};

const About = () => (
  <RegistrationProvider>
    <AboutContent />
  </RegistrationProvider>
);

export default About;
