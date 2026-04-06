import React from 'react';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Impressum
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Angaben gemäß § 5 DDG
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              CareerLeap GbR
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>Solomon Banuba</p>
              <p>David Yoatse</p>
              <p>Akua Gyamea Ampem</p>
              <p>Oberspreestraße 61c</p>
              <p>12439 Berlin</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Vertreten durch die Gesellschafter
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>Solomon Banuba</p>
              <p>David Yoatse</p>
              <p>Akua Gyamea Ampem</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Kontakt
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>Telefon: +49 152 92607231</p>
              <p>E-Mail: info@career-leap.academy</p>
              <p>
                Website:{' '}
                <a 
                  href="https://career-leap.academy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  https://career-leap.academy
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>Solomon Banuba</p>
              <p>Oberspreestraße 61c</p>
              <p>12439 Berlin</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Umsatzsteuer-Identifikationsnummer
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Wird nach Erhalt ergänzt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
