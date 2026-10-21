import { Component, getApplication } from '@actito/web-core';
import { logger } from '~/logger';

export class UserInboxComponent extends Component {
  constructor() {
    super('user-inbox');
  }

  configure() {
    //
  }

  async launch(): Promise<void> {
    const application = getApplication();
    if (!application?.inboxConfig?.useUserInbox) {
      logger.warning(
        'Using the user-level inbox module, but the user-level inbox is not enabled for this application.',
      );
    }
  }

  async unlaunch(): Promise<void> {
    //
  }
}
