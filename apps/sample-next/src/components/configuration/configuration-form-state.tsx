export interface ConfigurationFormState {
  debugLoggingEnabled: boolean;
  applicationVersion: string;
  language: string;
  serviceWorkerLocation: string;
  serviceWorkerScope: string;
  geolocationHighAccuracyEnabled: boolean;
  geolocationMaximumAge: string;
  geolocationTimeout: string;
}
