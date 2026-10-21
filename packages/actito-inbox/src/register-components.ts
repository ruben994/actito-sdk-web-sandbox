import { registerComponent } from '@actito/web-core';
import { InboxComponent } from './internal/inbox-component';

export function registerComponents() {
  registerComponent(new InboxComponent());
}
