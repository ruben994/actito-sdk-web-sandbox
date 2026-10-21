import { registerComponent } from '@actito/web-core';
import { UserInboxComponent } from './internal/user-inbox-component';

export function registerComponents() {
  registerComponent(new UserInboxComponent());
}
