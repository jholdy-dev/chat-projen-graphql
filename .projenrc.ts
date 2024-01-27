import { typescript } from 'projen';
import { Backend, Frontend, Iac } from './projenrc';

const root = new typescript.TypeScriptProject({
  authorName: 'Jholdy Damasceno',
  defaultReleaseBranch: 'main',
  name: 'chat-app',
  projenrcTs: true,
});

root.eslint?.addIgnorePattern('**/node_modules/**');

root.package.addField('prettier', {
  singleQuote: true,
  semi: true,
  trailingComma: 'es5',
});

new Iac({
  name: 'iac',
  cdkVersion: '2.1.0',
  outdir: './projects/iac',
  authorName: 'Jholdy Damasceno',
  authorEmail: 'jholdydamasceno@gmail.com',
  defaultReleaseBranch: 'main',
  parent: root,
  testdir: './src',
});

new Backend({
  name: 'backend',
  defaultReleaseBranch: 'main',
  authorName: 'Jholdy Damasceno',
  authorEmail: 'jholdydamasceno@gmail.com',
  outdir: './projects/backend/app-code',
  parent: root,
});

new Frontend({
  name: 'frontend',
  outdir: './projects/frontend/app-code',
  parent: root,
  defaultReleaseBranch: 'main',
  authorName: 'Jholdy Damasceno',
  authorEmail: 'jholdydamasceno@gmail.com',
});

root.synth();
