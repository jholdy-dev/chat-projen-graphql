import { JsonFile } from 'projen';
import {
  TypeScriptAppProject,
  TypeScriptProjectOptions,
} from 'projen/lib/typescript';
import { setEslint } from './set-eslint';

export class Backend extends TypeScriptAppProject {
  constructor(options: TypeScriptProjectOptions) {
    super({
      ...options,
      deps: [
        'graphql-tag',
        'graphql@^16.8.1',
        'class-validator',
        'graphql-scalars',
        'graphql-ws',
        'ws',
        'type-graphql@2.0.0-beta.6',
        'reflect-metadata',
        'graphql-yoga',
      ],
      devDeps: ['ts-node-dev', '@types/node', '@types/ws'],
      tsconfigDev: {
        compilerOptions: {
          target: 'es2021',
          module: 'commonjs',
          lib: ['es2021'],
          strictPropertyInitialization: false,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
      },
      tsconfig: {
        compilerOptions: {
          target: 'es2021',
          module: 'commonjs',
          lib: ['es2021'],
          strictPropertyInitialization: false,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
      },
    });

    setEslint(this);

    this.addTask('backend:dev', {
      env: {
        NODE_ENV: 'development',
        PORT: '4000',
      },
      exec: 'tsnd --respawn --transpile-only src/server.ts',
    });

    this.addTask('backend:build', {
      exec: 'tsc src/server.ts --experimentalDecorators "true" --emitDecoratorMetadata "true" --outDir ./dist',
    });

    this.addTask('backend:start', {
      exec: 'node dist/server.js',
    });

    new JsonFile(this, '.prettierrc.json', {
      obj: {
        trailingComma: 'all',
        printWidth: 120,
        singleQuote: true,
        identSize: 2,
        tabWidth: 2,
        overrides: [],
      },
    });
  }
}
