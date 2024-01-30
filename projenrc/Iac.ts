import { JsonFile } from 'projen';
import {
  AwsCdkTypeScriptApp,
  AwsCdkTypeScriptAppOptions,
} from 'projen/lib/awscdk';
import { TypeScriptModuleResolution } from 'projen/lib/javascript';
import { setEslint } from './set-eslint';

export class Iac extends AwsCdkTypeScriptApp {
  constructor(options: AwsCdkTypeScriptAppOptions) {
    super({
      ...options,
      deps: ['awscdk-appsync-utils'],
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

    new JsonFile(this, '.prettierrc.json', {
      obj: {
        trailingComma: 'all',
        printWidth: 120,
        singleQuote: true,
        overrides: [],
      },
    });
  }
}
