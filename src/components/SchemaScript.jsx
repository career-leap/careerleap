import React from 'react';

/**
 * Reusable JSON-LD schema component for structured data.
 * Use inside <Helmet> to inject Schema.org markup per page.
 */
export default function SchemaScript({ schema }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
