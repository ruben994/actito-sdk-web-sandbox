export interface ActitoOptions {
  applicationKey: string;
  applicationSecret: string;
  applicationVersion?: string;
  language?: string;
  serviceWorker?: string;
  serviceWorkerScope?: string;
  geolocation?: ActitoGeolocationOptions;
  hosts?: ActitoHostsOptions;
}

export interface ActitoGeolocationOptions {
  timeout?: number;
  enableHighAccuracy?: boolean;
  maximumAge?: number;
}

export interface ActitoHostsOptions {
  cloudApi?: string;
  restApi?: string;
}
