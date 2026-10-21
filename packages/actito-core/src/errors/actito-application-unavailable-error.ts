export class ActitoApplicationUnavailableError extends Error {
  constructor() {
    super(
      'Actito application unavailable at the moment. It becomes available after the first ready event.',
    );
    Object.setPrototypeOf(this, ActitoApplicationUnavailableError.prototype);
  }
}
