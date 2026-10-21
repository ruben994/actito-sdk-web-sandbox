export class ActitoDeviceUnavailableError extends Error {
  constructor() {
    super(
      'Actito device unavailable at the moment. It becomes available after the first ready event.',
    );
    Object.setPrototypeOf(this, ActitoDeviceUnavailableError.prototype);
  }
}
