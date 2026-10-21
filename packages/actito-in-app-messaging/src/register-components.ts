import { registerComponent } from '@actito/web-core';
import { IamComponent } from './internal/iam-component';

export function registerComponents() {
  registerComponent(new IamComponent());
}
