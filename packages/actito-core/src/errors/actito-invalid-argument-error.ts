export class ActitoInvalidArgumentError extends Error {
  constructor(readonly message: string) {
    super(message);
    Object.setPrototypeOf(this, ActitoInvalidArgumentError.prototype);
  }
}
