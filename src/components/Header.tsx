"use client";

import Image from "next/image";
// import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useState } from "react";

// TODO Find a better solution
const basePath = "/turk-veritabani";

export default function Header() {
  // const t = useTranslations('navigation');

  return (
    <header className="w-full pb-6 flex justify-between items-center">
      <nav>
        <ul className="flex gap-6">
          <li>
            <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
            >
              <Image
                  aria-hidden
                  src={basePath + "/globe.svg"}
                  alt="Globe icon"
                  width={16}
                  height={16}
              />
              Türk Veritabanı uygulaması - v{process.env.NEXT_PUBLIC_APP_VERSION}
            </a>
          </li>
          <li>
            <AboutModalLink />
          </li>
          {/*<li>*/}
          {/*  <Link href="/">{t('home')}</Link>*/}
          {/*</li>*/}
          {/*<li>*/}
          {/*  <Link href="/about">{t('about')}</Link>*/}
          {/*</li>*/}
        </ul>
      </nav>
      <LanguageSwitcher />
    </header>
  );
}



// TODO Rewrite it
// ----------------------------------------------------------------


const AboutModalLink = () => {
  const t = useTranslations('navigation');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
      <>
        <a
            href="#"
            onClick={openModal}
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <Image
              aria-hidden
              src={basePath + "/file.svg"}
              alt={t('about')}
              width={16}
              height={16}
          />
          {t('about')}
        </a>

        {/* Modal Overlay */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-[#0d1117] bg-opacity-50 flex items-center justify-center z-[99999999]"
                onClick={closeModal}
            >
              {/* Modal Content */}
              <div
                  className="bg-white dark:bg-[#0d1117] border border-gray-400/50 p-6 rounded shadow-lg max-w-xl w-full"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                <h2 className="text-2xl font-bold mb-4">Türk Veritabanı uygulaması</h2>
                <h3 className="text-lg font-bold mb-2">🇬🇧 English</h3>
                <p className="text-sm mb-2">
                  "Turkic Database" is an interactive app of Turkic world: Languages, maps,
                  inscriptions and more...
                </p>
                <p className="text-sm mb-2">
                  As of 2025 February, it's under early stages of development. More sources (reference books,
                  articles), UI translated in more Turkic languages, and more advanced features will come in
                  the upcoming months. You're welcome to support in any way: Sharing well-checked OCR versions
                  of certain reference books, ideas, connections, code review and code contribution...
                  Shortly anything! Source code is available at GitHub:
                  {' '}
                  <a href="https://github.com/pemre/turk-veritabani"
                     className="text-blue-600 hover:underline text-sm">
                    https://github.com/pemre/turk-veritabani
                  </a>
                </p>
                <h3 className="text-lg font-bold mb-2 mt-4">🇹🇷 Türkiye Türkçesi</h3>
                <p className="text-sm mb-2">
                  "Türk Veritabanı" Türk dünyasının etkileşimli bir uygulamasıdır: Diller, haritalar,
                  yazıtlar ve daha fazlası...
                </p>
                <p className="text-sm mb-2">
                  2025 Şubat itibarıyla geliştirme sürecinin erken aşamalarındadır. Önümüzdeki aylarda daha
                  fazla kaynak (referans kitaplar, makaleler), daha fazla Türk dilinde çevrilmiş kullanıcı
                  arayüzü ve daha gelişmiş özellikler gelecek. Her türlü desteğe açığız: Belirli referans
                  kitaplarının dikkatle OCR’lanmış sürümlerini paylaşmak, fikirler, bağlantılar, kod
                  incelemesi ve kod katkısı... Kısacası her türlü destek! Kaynak kod GitHub’da:
                  {' '}
                  <a href="https://github.com/pemre/turk-veritabani"
                     className="text-blue-600 hover:underline text-sm">
                    https://github.com/pemre/turk-veritabani
                  </a>
                </p>
                <h3 className="text-lg font-bold mb-2 mt-4">🇦🇿 Azerbaycan Türkçesi</h3>
                <p className="text-sm mb-2">
                  Bu, Türk dünyasının interaktiv tətbiqidir: Dillər, xəritələr, yazıtlar və daha çox...
                </p>
                <p className="text-sm mb-2">
                  2025-ci ilin fevralı etibarilə, tətbiq inkişafın erkən mərhələsindədir. Gələcək aylarda daha
                  çox mənbə (istinad kitabları, məqalələr), daha çox Türk dilinə tərcümə olunmuş istifadəçi
                  interfeysi və daha qabaqcıl xüsusiyyətlər gələcək. İstənilən formada dəstəyə açığıq:
                  müəyyən istinad kitablarının yaxşı yoxlanılmış OCR versiyalarını paylaşmaq, ideyalar,
                  əlaqələr, kod icmalı və töhfə vermək... Qısacası, hər cür dəstək! Mənbə kod GitHub-da
                  mövcuddur:
                  {' '}
                  <a href="https://github.com/pemre/turk-veritabani"
                     className="text-blue-600 hover:underline text-sm">
                    https://github.com/pemre/turk-veritabani
                  </a>
                </p>
              </div>
            </div>
        )}
      </>
  );
}
