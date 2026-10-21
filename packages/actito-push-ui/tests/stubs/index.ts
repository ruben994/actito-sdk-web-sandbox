import type { ActitoApplication, ActitoNotification } from '@actito/web-core';

export const DEFAULT_ACTITO_NOTIFICATION: ActitoNotification = {
  id: '1d9e80ef851d212aca82cf23',
  partial: false,
  type: 're.notifica.notification.Alert',
  time: '2026-04-28T15:30:20Z',
  title: undefined,
  subtitle: undefined,
  message: 'Message',
  content: [],
  actions: [],
  attachments: [],
  extra: {},
};

export const DEFAULT_ACTITO_APPLICATION: ActitoApplication = {
  id: '123',
  name: 'My App',
  category: 'Other',
  services: {},
  userDataFields: [],
  actionCategories: [],
};
