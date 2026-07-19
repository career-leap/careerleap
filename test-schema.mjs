import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SchemaScript from './src/components/SchemaScript.jsx';

const e = React.createElement;

try {
  const html = ReactDOMServer.renderToString(e('div', {}, e(SchemaScript, { schema: { test: true } })));
  console.log('Rendered:', html);
} catch (err) {
  console.error('Error:', err.message);
}
