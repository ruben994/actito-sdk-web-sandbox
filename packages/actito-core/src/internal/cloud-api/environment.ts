import { ActitoNotConfiguredError } from '~/errors/actito-not-configured-error';
import { getOptions } from '~/internal/options';

export function getCloudApiEnvironment() {
  const options = getOptions();
  if (!options) throw new ActitoNotConfiguredError();

  return {
    cloudHost: options.hosts.cloudApi,
    applicationKey: options.applicationKey,
    applicationSecret: options.applicationSecret,
  };
}
