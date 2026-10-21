export class ActitoNotConfiguredError extends Error {
  constructor() {
    super("Actito hasn't been configured.");
    Object.setPrototypeOf(this, ActitoNotConfiguredError.prototype);
  }
}
