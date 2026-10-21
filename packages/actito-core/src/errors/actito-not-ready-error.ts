export class ActitoNotReadyError extends Error {
  constructor() {
    super('Actito is not ready.');
    Object.setPrototypeOf(this, ActitoNotReadyError.prototype);
  }
}
