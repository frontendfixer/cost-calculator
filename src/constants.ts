import packageJson from '../package.json';
import { slugToTitle } from './lib/utils';

export const constants = {
  app_name: slugToTitle(packageJson.name),
  app_description: packageJson.description,
  app_version: packageJson.version,
};
