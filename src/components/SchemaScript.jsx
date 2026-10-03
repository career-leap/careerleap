import React from 'react';

export default function SchemaScript({ schema }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
