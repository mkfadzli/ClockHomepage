import fs from 'fs';
import path from 'path';

const AUDIO_EXTENSIONS = new Set([
  '.mp3',
  '.wav',
  '.ogg',
  '.m4a',
  '.aac',
  '.flac',
  '.webm',
  '.opus',
  '.wma',
  '.aiff',
  '.aif',
  '.mid',
  '.midi',
]);

function listToneFiles(tonesDir) {
  if (!fs.existsSync(tonesDir)) {
    fs.mkdirSync(tonesDir, { recursive: true });
    return [];
  }

  return fs
    .readdirSync(tonesDir)
    .filter((file) => {
      if (file === 'manifest.json') return false;
      return AUDIO_EXTENSIONS.has(path.extname(file).toLowerCase());
    })
    .sort((a, b) => a.localeCompare(b));
}

function writeManifest(publicDir) {
  const tonesDir = path.join(publicDir, 'tones');
  const tones = listToneFiles(tonesDir);
  const manifestPath = path.join(tonesDir, 'manifest.json');

  fs.writeFileSync(manifestPath, `${JSON.stringify({ tones }, null, 2)}\n`);
}

export function tonesManifestPlugin() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const tonesDir = path.join(publicDir, 'tones');

  const refresh = () => writeManifest(publicDir);

  return {
    name: 'tones-manifest',
    buildStart: refresh,
    configureServer(server) {
      refresh();

      if (!fs.existsSync(tonesDir)) {
        fs.mkdirSync(tonesDir, { recursive: true });
      }

      server.watcher.add(tonesDir);
      server.watcher.on('add', (file) => {
        if (file.startsWith(tonesDir)) refresh();
      });
      server.watcher.on('unlink', (file) => {
        if (file.startsWith(tonesDir)) refresh();
      });
    },
  };
}
