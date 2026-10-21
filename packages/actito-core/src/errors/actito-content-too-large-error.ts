export class ActitoContentTooLargeError extends Error {
  constructor(readonly message: string) {
    super(message);
    Object.setPrototypeOf(this, ActitoContentTooLargeError.prototype);
  }
}
