import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Datenschutzerklärung
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Stand: 04.2026
          </p>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre personenbezogenen Daten ausschließlich im Einklang mit den gesetzlichen Vorschriften der Datenschutz-Grundverordnung (DSGVO) sowie den geltenden deutschen Datenschutzgesetzen.
          </p>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Mit dieser Datenschutzerklärung informieren wir Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website.
          </p>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              1. Verantwortlicher
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <div className="text-gray-600 dark:text-gray-400 space-y-1 mb-4">
              <p className="font-semibold">CareerLeap GbR</p>
              <p>Solomon Banuba</p>
              <p>David Yoatse</p>
              <p>Akua Gyamea Ampem</p>
              <p>Oberspreestraße 61c</p>
              <p>12439 Berlin</p>
              <p>Deutschland</p>
            </div>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
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

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              2. Hosting
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unsere Website wird bei folgendem Anbieter gehostet:
            </p>
            <div className="text-gray-600 dark:text-gray-400 space-y-1 mb-4">
              <p className="font-semibold">Namecheap, Inc.</p>
              <p>4600 East Washington Street</p>
              <p>Suite 300</p>
              <p>Phoenix, AZ 85034</p>
              <p>USA</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Beim Besuch unserer Website erfasst der Hosting-Anbieter automatisch Informationen in sogenannten Server-Logfiles. Dies sind:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-4 ml-4">
              <li>IP-Adresse des Besuchers</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400">
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der technisch fehlerfreien Darstellung und Sicherheit unserer Website.
            </p>
          </section>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              3. Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unsere Website verwendet sogenannte Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cookies richten keinen Schaden an und enthalten keine Viren.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Die Speicherung von Cookies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) sowie §25 TTDSG, sofern eine entsprechende Einwilligung abgefragt wurde.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Sie können Ihre Einwilligung jederzeit über die Cookie-Einstellungen Ihrer Browsers widerrufen.
            </p>
          </section>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              4. Webanalyse (Analytics)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unsere Website kann Analyse-Tools verwenden, um das Nutzerverhalten zu analysieren und unser Angebot zu verbessern.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dabei können Informationen über die Nutzung unserer Website erfasst werden, beispielsweise:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-4 ml-4">
              <li>besuchte Seiten</li>
              <li>Verweildauer</li>
              <li>verwendete Geräte</li>
              <li>Herkunft der Besucher</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Die Verarbeitung erfolgt ausschließlich auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Die Analyse dient ausschließlich der Verbesserung unserer Website und unseres Angebots.
            </p>
          </section>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              5. Kontaktformular und Bewerbungsformular
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Wenn Sie uns über ein Formular auf unserer Website kontaktieren oder sich für Programme von CareerLeap bewerben, werden die von Ihnen eingegebenen Daten gespeichert und verarbeitet.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dies kann folgende Daten umfassen:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-4 ml-4">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>beruflicher oder akademischer Hintergrund</li>
              <li>weitere freiwillige Angaben</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Die Verarbeitung dieser Daten erfolgt zum Zweck der Bearbeitung Ihrer Anfrage oder Bewerbung.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
            </p>
          </section>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              6. Weitergabe von Daten
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt grundsätzlich nicht, außer:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-4 ml-4">
              <li>wenn Sie ausdrücklich eingewilligt haben</li>
              <li>wenn dies zur Vertragserfüllung erforderlich ist</li>
              <li>wenn wir gesetzlich dazu verpflichtet sind</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              7. Speicherdauer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Personenbezogene Daten werden nur so lange gespeichert, wie dies zur Erfüllung der jeweiligen Zwecke erforderlich ist.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Sobald der Zweck der Speicherung entfällt oder Sie Ihre Einwilligung widerrufen, werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              8. Ihre Rechte
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sie haben im Rahmen der DSGVO folgende Rechte:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-4 ml-4">
              <li>Recht auf Auskunft über Ihre gespeicherten Daten</li>
              <li>Recht auf Berichtigung unrichtiger Daten</li>
              <li>Recht auf Löschung Ihrer Daten</li>
              <li>Recht auf Einschränkung der Verarbeitung</li>
              <li>Recht auf Datenübertragbarkeit</li>
              <li>Recht auf Widerspruch gegen die Verarbeitung</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Zur Ausübung Ihrer Rechte können Sie uns jederzeit kontaktieren:
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <a 
                href="mailto:info@career-leap.academy"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                info@career-leap.academy
              </a>
            </p>
          </section>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              9. Beschwerderecht bei der Aufsichtsbehörde
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Zuständige Aufsichtsbehörde:
            </p>
            <div className="text-gray-600 dark:text-gray-400 space-y-1 mb-4">
              <p className="font-semibold">Berliner Beauftragte für Datenschutz und Informationsfreiheit</p>
              <p>Alt-Moabit 59-61</p>
              <p>10555 Berlin</p>
              <p>Deutschland</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Website:</p>
            <p className="text-gray-600 dark:text-gray-400">
              <a 
                href="https://www.datenschutz-berlin.de" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                https://www.datenschutz-berlin.de
              </a>
            </p>
          </section>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              10. Datensicherheit
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Wir verwenden geeignete technische und organisatorische Maßnahmen, um Ihre personenbezogenen Daten gegen Verlust, Missbrauch oder unbefugten Zugriff zu schützen.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Unsere Website nutzt eine verschlüsselte Verbindung (HTTPS), um Daten sicher zu übertragen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
