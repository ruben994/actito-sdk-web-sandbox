import { getApplication, getOptions } from '@actito/web-core';

export function getEmailUrl(email: string): string {
  return prefixed(email, 'mailto:');
}

export function getSmsUrl(phoneNumber: string): string {
  return prefixed(phoneNumber, 'sms:');
}

export function getTelephoneUrl(phoneNumber: string): string {
  return prefixed(phoneNumber, 'tel:');
}

function prefixed(value: string, prefix: string): string {
  if (value.startsWith(prefix)) return value;
  return `${prefix}${value}`;
}

export function getApplicationIcon(): string | undefined {
  const options = getOptions();
  if (!options) return undefined;

  const icon = getApplication()?.websitePushConfig?.icon;
  if (!icon) return undefined;

  return `${options.hosts.restApi}/upload${icon}`;
}

export function getApplicationName(): string | undefined {
  const application = getApplication();
  if (!application) return undefined;

  return application.websitePushConfig?.launchConfig?.applicationName ?? application.name;
}
