export class ActitoNetworkRequestError extends Error {
  constructor(public readonly response: Response) {
    super(`Failed to fetch a resource with response code '${response.status}'.`);
    Object.setPrototypeOf(this, ActitoNetworkRequestError.prototype);
  }
}
