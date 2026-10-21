export class ActitoServiceUnavailableError extends Error {
  constructor(readonly service: string) {
    super(
      `Actito '${service}' service is not available. Check the dashboard and documentation to enable it.`,
    );
    Object.setPrototypeOf(this, ActitoServiceUnavailableError.prototype);
  }
}
