import assert from 'assert';
import type { TypeScriptProject } from 'projen/lib/typescript';

export const setEslint = (project: TypeScriptProject) => {
  assert(project.eslint, 'eslint must be defined');

  if (project.prettier) {
    project.addDevDeps('eslint-plugin-prettier@5.0.1', 'prettier@3.1.0');
  }

  project.eslint.addExtends('eslint:recommended');
  project.eslint.addExtends('plugin:@typescript-eslint/recommended');
  project.eslint.addExtends('plugin:storybook/recommended');
  project.eslint.addExtends('prettier');

  project.eslint.addRules({
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    'no-unreachable': ['error'],
    '@typescript-eslint/no-floating-promises': ['off'],
    'no-debugger': ['error'],
  });
};
