'use client';

import { TextScramble } from '@/components/ui/text-scramble';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import barbershopImgUrl from '@/assets/barbershop.png';

// Mac-inspired SVG Computer Display Component
const ComputerDisplay = ({ imageUrl }: { imageUrl: StaticImageData }) => {
  // Calculate aspect ratio from the image
  const aspectRatio = imageUrl.width / imageUrl.height;
  const screenWidth = 340;
  const screenHeight = screenWidth / aspectRatio;
  const yOffset = Math.max(30, (240 - screenHeight) / 2);

  return (
    <svg viewBox="30 7 360 311" className="h-auto w-full max-w-lg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      {/* Monitor Body - Gray */}
      <rect x="36" y="31" width="348" height="191" rx="20" fill="#3d3d3d" />

      {/* Screen with image - respecting aspect ratio */}
      <defs>
        <clipPath id="screenClip">
          <rect x="40" y={yOffset} width={screenWidth} height={screenHeight} rx="16" />
        </clipPath>
      </defs>

      {/* Barbershop image on screen */}
      <image xlinkHref={imageUrl.src} x="40" y={yOffset} width={screenWidth} height={screenHeight} preserveAspectRatio="xMidYMid meet" clipPath="url(#screenClip)" />

      {/* Screen Border/Shine */}
      <rect x="40" y={yOffset} width={screenWidth} height={screenHeight} rx="16" fill="none" stroke="rgb(63, 63, 63)" strokeWidth="1" />

      {/* Monitor camera notch (like Apple) */}
      <circle cx="210" cy="35" r="4" fill="rgb(63, 63, 63)" opacity="0.8" />

      {/* Stand - completely redesigned */}
      {/* Left stand leg */}
      {/* <path d="M 140 245 L 110 300 L 100 300 L 130 245 Z" fill="rgb(63, 63, 63)" /> */}
      {/* Right stand leg */}
      {/* <path d="M 280 245 L 310 300 L 320 300 L 290 245 Z" fill="rgb(63, 63, 63)" /> */}
      {/* Stand base */}
      <rect x="100" y="221" width="222" height="12" rx="6" fill="#3d3d3d" />
      {/* Stand base shadow */}
    </svg>
  );
};
const BarberShopP = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/5 to-purple-900/9">
      {/* Hero Section */}
      <section className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Contenu principal */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-grey-900 mb-3 inline-block rounded-full bg-amber-700 px-3 py-1 text-sm font-medium">Application Web</span>
                <h1 className="text-5xl font-bold text-white lg:text-5xl">
                  <TextScramble text="Projet&nbsp;BarberShop" />
                </h1>
                <p className="text-xl text-gray-300">Template web professionnel pour barber</p>
              </div>

              <p className="text-lg leading-relaxed text-gray-300">
                Un modèle complet et personnalisable pour les salons de coiffure et barbershops. Présentez votre équipe, vos services, vos tarifs et permettez à vos clients de prendre rendez-vous en
                ligne. Conçu pour être moderne, rapide et optimisé pour tous les appareils.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#features" className="flex items-center justify-center space-x-2 rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-amber-800">
                  <span>✂️</span>
                  <span>Découvrir les fonctionnalités</span>
                </a>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">100%</div>
                  <div className="text-sm text-gray-400">Personnalisable</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">⚡</div>
                  <div className="text-sm text-gray-400">Haute Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">📱</div>
                  <div className="text-sm text-gray-400">Mobile First</div>
                </div>
              </div>
            </div>

            {/* Display image and computer mockup */}
            <div className="flex w-full flex-col items-center justify-center gap-8">
              {/* Computer SVG Display with barbershop image */}
              <a href="https://thefrenchebarber.netlify.app/barber-240" target="_blank" rel="noopener noreferrer" className="w-full transition-transform hover:scale-105">
                <ComputerDisplay imageUrl={barbershopImgUrl} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-950/50 px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Fonctionnalités Principales</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">Tous les outils nécessaires pour gérer et promouvoir votre salon de coiffure en ligne.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-sm bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-xl text-white">👥</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Gestion d&apos;équipe</h3>
              <p className="text-gray-300">Présentez vos coiffeurs et barbiers avec photos et spécialités. Laissez les clients choisir leur préféré.</p>
            </div>

            <div className="rounded-sm bg-gradient-to-br from-amber-900/20 to-amber-800/20 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600">
                <span className="text-xl text-white">✂️</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Catalogue de services</h3>
              <p className="text-gray-300">Listez tous vos services avec descriptions, durées et tarifs. Facilitez la décision de vos clients.</p>
            </div>

            <div className="rounded-sm bg-gradient-to-br from-green-900/20 to-green-800/20 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                <span className="text-xl text-white">📅</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Système de réservation</h3>
              <p className="text-gray-300">Calendrier interactif pour que les clients réservent leurs créneaux en ligne, 24h/24.</p>
            </div>

            <div className="rounded-sm bg-gradient-to-br from-purple-900/20 to-purple-800/20 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                <span className="text-xl text-white">⭐</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Avis et témoignages</h3>
              <p className="text-gray-300">Section pour afficher les avis clients et construire la confiance. Gérez vos commentaires facilement.</p>
            </div>

            <div className="rounded-sm bg-gradient-to-br from-red-900/20 to-red-800/20 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
                <span className="text-xl text-white">📸</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Galerie de photos</h3>
              <p className="text-gray-300">Showcase vos meilleurs travaux avec une galerie élégante et optimisée pour les mobiles.</p>
            </div>

            <div className="rounded-sm bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 p-6 transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-600">
                <span className="text-xl text-white">📞</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Formulaire de contact</h3>
              <p className="text-gray-300">Gardez le contact avec vos clients. Formulaire simple et efficace pour les demandes spéciales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Image Section */}
      <section className="bg-gray-950 px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Exemple de site généré pour un client</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">Un site totalement personnalisable, conçu pour répondre aux besoins spécifiques de chaque client.</p>
          </div>

          {/* Image Container - Full width, respects aspect ratio */}
          <div className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-2xl">
            <a href="https://thefrenchebarber.netlify.app/barber-240" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
              <Image src={barbershopImgUrl} alt="Salon de coiffure" width={1200} height={675} className="h-auto w-full" sizes="100vw" priority />
            </a>
          </div>

          {/* Visit Button */}
          <div className="mt-12 text-center">
            <a
              href="https://thefrenchebarber.netlify.app/barber-240"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-amber-700 px-10 py-4 font-semibold text-white transition-all duration-200 hover:bg-amber-800 hover:shadow-lg">
              <span className="flex items-center gap-2">
                <span>🌐</span>
                <span>Visiter le site client</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Technical Stack Section */}
      <section className="bg-gradient-to-br from-gray-800/5 to-purple-900/9 px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">Caractéristiques Techniques</h2>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-sm bg-gray-950/50 p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                  <span className="mr-3 h-2 w-2 rounded-full bg-blue-600"></span>
                  Technologie
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="font-medium">Frontend:</span> Next.js 16, React 19, TypeScript
                  </p>
                  <p>
                    <span className="font-medium">Styling:</span> Tailwind CSS, Responsive Design
                  </p>
                  <p>
                    <span className="font-medium">Animation:</span> Fluides et optimisées
                  </p>
                  <p>
                    <span className="font-medium">Performance:</span> SEO optimisé, Rapid loading
                  </p>
                </div>
              </div>

              <div className="rounded-sm bg-gray-950/50 p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                  <span className="mr-3 h-2 w-2 rounded-full bg-amber-600"></span>
                  Avantages
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✓ Entièrement personnalisable selon vos couleurs et branding</li>
                  <li>✓ Responsive sur tous les appareils (mobile, tablette, desktop)</li>
                  <li>✓ Optimisé SEO pour le référencement local</li>
                  <li>✓ Intégration facile avec outils de paiement</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-sm bg-gray-950/50 p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                  <span className="mr-3 h-2 w-2 rounded-full bg-green-600"></span>
                  Qui devrait l&apos;utiliser
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Salons de coiffure indépendants</li>
                  <li>• Barbershops et salons de barbier</li>
                  <li>• Chaînes de salons multi-localisées</li>
                  <li>• Coiffeurs à domicile souhaitant une présence web</li>
                </ul>
              </div>

              <div className="rounded-sm bg-gray-950/50 p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                  <span className="mr-3 h-2 w-2 rounded-full bg-amber-600"></span>
                  Avantages pour vos clients
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">24/7</div>
                    <div className="text-sm text-gray-400">Réservation en ligne</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">📍</div>
                    <div className="text-sm text-gray-400">Localisation facile</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">Prêt à transformer votre salon ?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-amber-50">Lancez votre présence en ligne et offrez une meilleure expérience à vos clients dès aujourd&apos;hui.</p>

          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="flex items-center justify-center space-x-2 rounded-lg bg-white px-8 py-4 font-semibold text-amber-700 transition-colors duration-200 hover:bg-gray-100">
              <span>✂️</span>
              <span>Commencer</span>
            </button>
            <button className="flex items-center justify-center space-x-2 rounded-lg bg-amber-800 px-8 py-4 font-semibold text-white transition-colors duration-200 hover:bg-amber-900">
              <span>📚</span>
              <span>Documentation</span>
            </button>
          </div>

          <div className="text-sm text-amber-50">Modèle gratuit et open-source • Personnalisable selon vos besoins</div>
        </div>
      </section>
    </div>
  );
};

export default BarberShopP;
