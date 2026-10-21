export class ActitoAutoBadgeUnavailableError extends Error {
  constructor() {
    super('Actito auto badge functionality is not enabled.');
    Object.setPrototypeOf(this, ActitoAutoBadgeUnavailableError.prototype);
  }
}
