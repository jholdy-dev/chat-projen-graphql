import { JsonFile } from 'projen';
import {
  ReactTypeScriptProject,
  ReactTypeScriptProjectOptions,
} from 'projen/lib/web';

export class Frontend extends ReactTypeScriptProject {
  constructor(options: ReactTypeScriptProjectOptions) {
    super({
      ...options,
      deps: ['tailwindcss', '@apollo/client', 'graphql', 'graphql-ws', 'uuid'],
      devDeps: ['@types/uuid', 'eslint-plugin-storybook', 'prettier'],
    });

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
