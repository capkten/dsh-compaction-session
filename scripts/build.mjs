import {copyFileSync,mkdirSync} from 'node:fs';
mkdirSync(new URL('../lib/',import.meta.url),{recursive:true});
copyFileSync(new URL('../src/index.js',import.meta.url),new URL('../lib/index.js',import.meta.url));

copyFileSync(new URL('../src/settings.js',import.meta.url),new URL('../lib/settings.js',import.meta.url));
