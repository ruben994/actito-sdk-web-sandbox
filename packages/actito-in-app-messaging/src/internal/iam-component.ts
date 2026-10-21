import { Component, getApplication, getCurrentDevice } from '@actito/web-core';
import { evaluateContext, handleDocumentVisibilityChanged } from './internal-api';
import { dismissMessage } from './ui/message-presenter';

export class IamComponent extends Component {
  constructor() {
    super('in-app-messaging');
  }

  configure() {
    document.addEventListener('visibilitychange', () => {
      const { visibilityState } = document;
      handleDocumentVisibilityChanged(visibilityState);
    });
  }

  async launch(): Promise<void> {
    const application = getApplication();
    const device = getCurrentDevice();
    if (application?.websitePushConfig?.ignoreTemporaryDevices && !device) return;

    evaluateContext('launch');
  }

  async unlaunch(): Promise<void> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  processBroadcast(event: string, data?: unknown) {
    if (event === 'notification_opened') {
      dismissMessage();
    }
  }
}
