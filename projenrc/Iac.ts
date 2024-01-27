import { JsonFile } from 'projen';
import {
  AwsCdkTypeScriptApp,
  AwsCdkTypeScriptAppOptions,
} from 'projen/lib/awscdk';

export class Iac extends AwsCdkTypeScriptApp {
  constructor(options: AwsCdkTypeScriptAppOptions) {
    super({
      ...options,
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
