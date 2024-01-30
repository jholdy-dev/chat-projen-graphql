import { JsonFile } from 'projen';
import { TypeScriptModuleResolution } from 'projen/lib/javascript';
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
        'aws-lambda',
        '@graphql-yoga/plugin-graphql-sse',
      ],
      devDeps: [
        '@types/aws-lambda',
        'ts-node-dev',
        '@types/node',
        '@types/ws',
        'ts-loader',
        'webpack',
        'webpack-cli',
      ],
      tsconfigDev: {
        compilerOptions: {
          target: 'es2021',
          module: 'commonjs',
          lib: ['es2021'],
          strictPropertyInitialization: false,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          resolveJsonModule: true,
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
          resolveJsonModule: true,
          moduleResolution: TypeScriptModuleResolution.NODE,
          declaration: false,
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
      steps: [
        {
          name: 'remove dist',
          exec: 'rm -rf dist',
        },
        {
          name: 'create dist',
          exec: 'mkdir dist',
        },
        {
          name: 'copy Dockerfile',
          exec: 'cp Dockerfile dist/Dockerfile',
        },
        {
          name: 'copy package.json',
          exec: 'node ./generate-package.js',
        },
        {
          name: 'build',
          exec: 'tsc -p tsconfig.json --outDir dist/src',
        },
        {
          cwd: './dist',
          exec: 'npm install',
        },
      ],
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
