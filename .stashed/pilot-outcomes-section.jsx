// Pilot Outcomes Section - Stashed for later use
// This code was removed from Home.jsx on 2026-04-06
// To restore: copy this section back into Home.jsx and update the grid layout

// Note: This was part of a two-column section. When restoring, ensure proper layout.

// PILOT OUTCOMES CARD (to be restored when figures are available):
/*
<motion.div 
  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
  initial={{ opacity: 0, x: -50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6" />
  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Pilot Outcomes</h2>
  <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">(Updated per cohort)</p>
  
  <ul className="space-y-4">
    {[
      { label: 'Cohort completion rate', value: '[__%]' },
      { label: 'Portfolio artefact completion', value: '[__%]' },
      { label: 'Documentation quality improvement', value: '[__% average increase]' },
      { label: 'Interview readiness improvement', value: '[__% average increase]' }
    ].map((metric, index) => (
      <li key={index} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">{metric.value}</span>
      </li>
    ))}
  </ul>
  
  <p className="text-xs text-gray-500 dark:text-gray-500 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
    Metrics are derived from structured internal evaluation frameworks.
  </p>
</motion.div>
*/

// FULL SECTION CODE (both cards in two-column layout):
/*
{/* Pilot Outcomes & Institutional Alignment - Two Column Cards */}
<section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
  <div className="max-w-7xl mx-auto">
    <div className="grid md:grid-cols-2 gap-8">
      {/* Pilot Outcomes Card */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6" />
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Pilot Outcomes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">(Updated per cohort)</p>
        
        <ul className="space-y-4">
          {[
            { label: 'Cohort completion rate', value: '[__%]' },
            { label: 'Portfolio artefact completion', value: '[__%]' },
            { label: 'Documentation quality improvement', value: '[__% average increase]' },
            { label: 'Interview readiness improvement', value: '[__% average increase]' }
          ].map((metric, index) => (
            <li key={index} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{metric.value}</span>
            </li>
          ))}
        </ul>
        
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          Metrics are derived from structured internal evaluation frameworks.
        </p>
      </motion.div>

      {/* Institutional Alignment Card */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6" />
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Institutional Alignment</h2>
        
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            CareerLeap complements university education and supports early-career integration.
          </p>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
            <p className="text-slate-900 dark:text-white font-semibold mb-2">Our long-term objective</p>
            <p className="text-gray-600 dark:text-gray-400">
              To collaborate with universities and employers seeking structured transition pathways for international talent.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>
*/
