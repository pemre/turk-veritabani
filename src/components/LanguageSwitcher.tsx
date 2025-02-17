"use client"

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import React, {useState} from "react";

// TODO Find a better solution
const basePath = "/turk-veritabani";

export default function LanguageSwitcher() {
  const t = useTranslations('languages');
  const locale = useLocale();
  const pathname = usePathname();

    console.log('locale', locale);

    // Remove basePath and locale from pathname
  const pathnameWithoutBase = pathname.replace('/turk-veritabani', '');
  const path = pathnameWithoutBase.replace(/^\/[^\/]+/, '') || '/';

    const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
      <div className="flex items-center gap-6">

          <div className="relative inline-block text-left">
              {/* Dropdown Toggle Button */}
              <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  type="button"
                  className="inline-flex items-center px-2 py-1 text-center text-white bg-gray-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-800 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                  <Image
                      aria-hidden
                      src={basePath + "/language.svg"}
                      alt={t(locale)}
                      width={20}
                      height={20}
                  />
                  <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                  >
                      <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 4 4 4-4"
                      />
                  </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                  <div className="absolute right-0 z-[99999] mt-2 bg-white rounded-lg shadow-sm w-48 dark:bg-gray-700">
                      <ul
                          className="h-75 p-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownSearchButton"
                      >
                          {[
                              // TODO Get from common config
                              // TODO Is it possible to sort based on local lang?
                              "aze", // Turkish of Az
                              "bak",
                              "eng", // English
                              "kaz",
                              "kir",
                              "rus",
                              "tat",
                              "tuk",
                              "tur", // Turkish of Türkiye
                              "uig",
                              "uzb",
                          ].map((col) => {
                              // const { full, flag } = languageMap[col];
                              return (
                                  <li key={col}>
                                      <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                                          <Link
                                              href={`/${col}${path}`}
                                              className={locale === col ? 'font-bold' : ''}
                                          >
                                              {t(col)}
                                          </Link>
                                      </div>
                                  </li>
                              );
                          })}
                      </ul>
                  </div>
              )}
          </div>
      </div>

  );
} 