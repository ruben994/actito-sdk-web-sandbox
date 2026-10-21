import { registerComponent } from '@actito/web-core';
import { AssetsComponent } from './internal/assets-component';

export function registerComponents() {
  registerComponent(new AssetsComponent());
}
