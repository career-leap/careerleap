import { createServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const templatePath = path.resolve(distDir, 'index.html');

async function prerender() {
  console.log('Starting prerender...');

  // Start Vite in middleware mode so it can transpile JSX on the fly.
  const vite = await createServer({
    root: projectRoot,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const template = await fs.readFile(templatePath, 'utf-8');
    const { render, publicRoutes } = await vite.ssrLoadModule('/src/prerenderEntry.jsx');

    for (const route of publicRoutes) {
      const { html } = render(route, template);

      // Write to dist/<route>/index.html. For the root route, overwrite dist/index.html.
      const outputFile = route === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route, 'index.html');

      await fs.mkdir(path.dirname(outputFile), { recursive: true });
      await fs.writeFile(outputFile, html, 'utf-8');

      console.log(`Prerendered: ${route} -> ${path.relative(projectRoot, outputFile)}`);
    }

    console.log('Prerender complete.');
  } finally {
    await vite.close();
  }
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
