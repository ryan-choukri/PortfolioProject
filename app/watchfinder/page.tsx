'use client';

import { TextScramble } from '@/components/ui/text-scramble';
import { useEffect } from 'react';
import { IPhoneMockup } from 'react-device-mockup';
import Image from 'next/image';
import watchfinderImgUrl from '@/assets/watchfinder.png';
import swipeImgUrl from '@/assets/swipe.png';

const removeElementByClassAndStyle = () => {
  // HERE GET the element inside iphone-display with the background-color: rgb(204, 204, 204); and change its to transpar
  const iphoneDisplay = document.querySelector('.iphone-display');
  console.log(iphoneDisplay);
  if (!iphoneDisplay) return;
  //   ITS DISPLAY LIKE THIS on my
  //   display: flex; flex-direction: column; width: 100%; height: 8px; background-color: rgb(204, 204, 204); align-items: center; justify-content: flex-end;
  const screenElement = iphoneDisplay.querySelector(
    '[style*="background-color:rgb(204, 204, 204)"], [style*="background-color:#CCCCCC"], [style*="background-color: rgb(204, 204, 204)"]'
  ) as HTMLElement;
  console.log(screenElement);
  const getIphoneEl = iphoneDisplay.querySelector(
    '[style*="display:flex;flex-direction:column;position:relative;box-sizing:border-box;border-radius:28px;border-style:solid;border-width:4px;border-color:#666666;overflow:hidden'
  ) as HTMLElement;

  if (getIphoneEl) {
    getIphoneEl.style.boxShadow = 'rgb(14 14 14 / 58%) 2px 4px 13px 7px';
  }
  if (screenElement) {
    screenElement.remove();
  }
};
const WatchFinderPage = () => {
  useEffect(() => {
    // Initial call
    console.log('PASSAGE Initial call');
    removeElementByClassAndStyle();
    // Run when page becomes visible again (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('PASSAGE visibility change');

        setTimeout(removeElementByClassAndStyle, 100); // Small delay to ensure DOM is ready
      }
    };

    // Run when window gains focus (user comes back to window)
    const handleFocus = () => {
      console.log('PASSAGE handleFocus');

      setTimeout(removeElementByClassAndStyle, 100);
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/5 to-purple-900/9">
      {/* Hero Section - Compact et immédiatement visible */}
      <section className="px-6 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Contenu principal */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="mb-3 inline-block rounded-full bg-blue-900 px-3 py-1 text-sm font-medium text-blue-300">Application Mobile</span>
                <h1 className="text-5xl font-bold text-white lg:text-5xl">
                  <TextScramble text="WATCH&nbsp;FINDER" />
                </h1>
                <p className="text-xl text-gray-300">Swipe pour trouver un film ou une série</p>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                Découvrez votre prochain film préféré grâce à l&apos;art du swipe ✨<br /> Et à la curation alimentée par l&apos;IA, car les ressources sont illimitées, n&apos;est-ce pas ?
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://watch-finder.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700">
                  <span>📱</span>
                  <span>Site web</span>
                </a>
                {/* <button className="rounded-lg border border-gray-600 px-6 py-3 font-semibold text-gray-300 transition-colors duration-200 hover:bg-gray-700">Voir la démo</button> */}
              </div>
              {/* Stats rapides */}
              {/* <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">100+</div>
                  <div className="text-sm text-gray-400">Niveaux</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">4.8★</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">10k+</div>
                  <div className="text-sm text-gray-400">Joueurs</div>
                </div>
              </div> */}
            </div>

            {/* Mockup/Image */}
            <div className="justify-center lg:justify-center">
              <div className="iphone-display flex text-center">
                {/* box-shadow: 2px 2px 2px 3px red; */}
                <div className="mx-4">
                  <a href="https://watch-finder.netlify.app/" target="_blank" rel="noopener noreferrer">
                    <IPhoneMockup screenType="notch" frameColor={'#3f3f3f'} frameOnly hideStatusBar screenWidth={170}>
                      {/* display here an image src https://images.unsplash.com/photo-1650963310446-011fc6a28367?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D */}
                      <Image width={350} height={700} src={watchfinderImgUrl} alt="Screenshot du jeu Tout va bien" />
                    </IPhoneMockup>
                  </a>
                </div>
                <div className="mx-4">
                  <a href="https://watch-finder.netlify.app/" target="_blank" rel="noopener noreferrer">
                    <IPhoneMockup screenType="notch" frameColor={'#3f3f3f'} frameOnly hideStatusBar screenWidth={170}>
                      {/* display here an image src https://images.unsplash.com/photo-1650963310446-011fc6a28367?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D */}
                      <Image width={350} height={700} src={swipeImgUrl} alt="Screenshot du jeu Tout va bien" />
                    </IPhoneMockup>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section : Qu'est-ce que Tout va bien */}
      <section className="bg-gray-950/50 px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Un jeu de réflexion unique</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">Tout va bien transforme chaque énigme en une aventure narrative où logique et créativité se rencontrent.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="hover-shadow-blue-card rounded-sm bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-6 transition-all duration-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-xl text-white">🧩</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Énigmes Progressives</h3>
              <p className="text-gray-300">Découvrez plus de 100 niveaux avec une difficulté croissante, des mécaniques simples aux défis complexes.</p>
            </div>

            <div className="hover-shadow-green-card rounded-sm bg-gradient-to-br from-green-900/20 to-green-800/20 p-6 transition-all duration-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                <span className="text-xl text-white">⚡</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Gameplay Intuitif</h3>
              <p className="text-gray-300">Interface tactile optimisée pour mobile avec des contrôles fluides et une prise en main immédiate.</p>
            </div>

            <div className="hover-shadow-purple-card rounded-sm bg-gradient-to-br from-purple-900/20 to-purple-800/20 p-6 transition-all duration-200">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                <span className="text-xl text-white">🎨</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Design Moderne</h3>
              <p className="text-gray-300">Interface épurée avec des animations fluides et une expérience utilisateur soignée sur tous les écrans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Technique */}
      <section className="bg-gradient-to-br from-gray-800/5 to-purple-900/9 px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">Case Study Technique</h2>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="hover-shadow-yellow-card rounded-sm bg-gray-950/50 p-6 shadow-sm transition-all duration-200">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                  <span className="mr-3 h-2 w-2 rounded-full bg-blue-600"></span>
                  Stack Technique
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="font-medium">Frontend:</span> React Native, TypeScript
                  </p>
                  <p>
                    <span className="font-medium">State Management:</span> Redux Toolkit
                  </p>
                  <p>
                    <span className="font-medium">Animation:</span> React Native Reanimated
                  </p>
                  <p>
                    <span className="font-medium">Storage:</span> AsyncStorage, SQLite
                  </p>
                  <p>
                    <span className="font-medium">Build:</span> Expo EAS, Fastlane
                  </p>
                </div>
              </div>

              <div className="hover-shadow-purple-card rounded-sm bg-gray-950/50 p-6 shadow-sm transition-all duration-200">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                  <span className="mr-3 h-2 w-2 rounded-full bg-green-600"></span>
                  Défis Relevés
                </h3>
                <ul className="space-y-2 text-gray-300 dark:text-gray-300">
                  <li>• Optimisation des performances pour 60fps constants</li>
                  <li>• Système de sauvegarde et synchronisation multi-appareils</li>
                  <li>• Architecture modulaire pour faciliter l&apos;ajout de nouveaux niveaux</li>
                  <li>• Gestion offline-first avec synchronisation cloud</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="hover-shadow-green-card rounded-sm bg-gray-950/50 p-6 shadow-sm transition-all duration-200">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                  <span className="mr-3 h-2 w-2 rounded-full bg-purple-600"></span>
                  Apprentissages Clés
                </h3>
                <ul className="space-y-2 text-gray-300 dark:text-gray-300">
                  <li>• Maîtrise approfondie de React Native et son écosystème</li>
                  <li>• Optimisation de l&apos;UX mobile et des animations fluides</li>
                  <li>• Architecture d&apos;applications mobiles scalables</li>
                  <li>• Publication sur les stores iOS et Android</li>
                </ul>
              </div>

              <div className="hover-shadow-blue-card rounded-sm bg-gray-950/50 p-6 shadow-sm transition-all duration-200">
                <h3 className="mb-3 flex items-center text-xl font-semibold text-white">
                  <span className="mr-3 h-2 w-2 rounded-full bg-yellow-600"></span>
                  Métriques de Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">99%</div>
                    <div className="text-sm text-gray-400">Crash-free</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">&lt;500ms</div>
                    <div className="text-sm text-gray-400">Temps de chargement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-950/50 px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Fonctionnalités Principales</h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-blue-600">
                <span className="text-xl text-white">🎮</span>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Modes de Jeu Variés</h3>
                <p className="text-gray-300 dark:text-gray-300">Mode histoire, défis quotidiens, mode zen et compétitions communautaires pour tous les styles de jeu.</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-green-600">
                <span className="text-xl text-white">💾</span>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Sauvegarde Cloud</h3>
                <p className="text-gray-300 dark:text-gray-300">Synchronisation automatique de votre progression entre tous vos appareils avec sauvegarde sécurisée.</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-purple-600">
                <span className="text-xl text-white">🎯</span>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Système de Récompenses</h3>
                <p className="text-gray-300 dark:text-gray-300">Débloquez des succès, collectionnez des trophées et accédez à du contenu exclusif au fil de votre progression.</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-yellow-600">
                <span className="text-xl text-white">📊</span>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Statistiques Détaillées</h3>
                <p className="text-gray-300 dark:text-gray-300">Analysez votre progression avec des statistiques complètes et des graphiques de performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="bg-gradient-to-br from-gray-800/5 to-green-800/30 px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Aperçu du Jeu</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Screenshot placeholders avec mockup réaliste */}
            {[
              { title: 'Menu Principal', desc: 'Interface épurée et intuitive' },
              { title: 'Gameplay', desc: 'Mécaniques de jeu fluides' },
              { title: 'Progression', desc: 'Suivi détaillé des statistiques' },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative mb-4 h-96 w-full overflow-hidden rounded-2xl bg-gray-800 shadow-xl transition-transform duration-200 group-hover:scale-105">
                  <div className="absolute top-4 left-1/2 h-1 w-12 -translate-x-1/2 transform rounded-full bg-gray-600"></div>
                  <div className="flex h-full flex-col bg-gradient-to-br from-blue-600 to-purple-600 p-6 pt-8">
                    <div className="mb-4 text-center text-white">
                      <h3 className="text-lg font-bold">Tout va bien</h3>
                    </div>
                    <div className="flex-1 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <div className="text-center text-white">
                        <div className="mb-2 text-4xl">🎮</div>
                        <div className="text-sm opacity-75">{item.title}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="mb-1 font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion + CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">Prêt à relever le défi ?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">Rejoignez des milliers de joueurs qui développent leur logique et leur créativité avec Tout va bien.</p>

          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="flex items-center justify-center space-x-2 rounded-lg bg-white px-8 py-4 font-semibold text-blue-600 transition-colors duration-200 hover:bg-gray-100">
              <span>📱</span>
              <span>Télécharger sur l&apos;App Store</span>
            </button>
            <button className="flex items-center justify-center space-x-2 rounded-lg bg-gray-800 px-8 py-4 font-semibold text-white transition-colors duration-200 hover:bg-gray-700">
              <span>🤖</span>
              <span>Télécharger sur Google Play</span>
            </button>
          </div>

          <div className="text-sm text-blue-100">Disponible gratuitement avec achats intégrés optionnels</div>
        </div>
      </section>
    </div>
  );
};

export default WatchFinderPage;
