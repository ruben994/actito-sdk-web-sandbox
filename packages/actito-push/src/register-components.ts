import { registerComponent } from '@actito/web-core';
import { PushComponent } from './internal/push-component';

export function registerComponents() {
  registerComponent(new PushComponent());
}
