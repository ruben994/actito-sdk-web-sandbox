# MIGRATING

Actito 5.x is a complete rebranding of the Notificare SDK. Most of the migration involves updating the implementation from Notificare to Actito while keeping the original method invocations.

## Breaking changes

### Dependencies

#### Installing through NPM

The SDK package name has been changed from `notificare-web` to `actito-web`. To use the correct one, simply uninstall the old package and install the new one.

##### Step 1: Remove the old package

```
npm uninstall notificare-web
```

##### Step 2: Install the new package

```
npm install actito-web
```

#### Installing through the CDN

If you are loading the packages as script modules through the CDN, you should import the new packages as the example below. The new CDN is hosted at `cdn-mobile.actito.com`, and the package names have also been updated.

```diff
<!DOCTYPE html>
<html>
<head>
-  <link rel="stylesheet" href="https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-in-app-messaging.css" />
-  <link rel="stylesheet" href="https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-push.css" />
-  <link rel="stylesheet" href="https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-push-ui.css" />
+  <link rel="stylesheet" href="https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-in-app-messaging.css" />
+  <link rel="stylesheet" href="https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-push.css" />
+  <link rel="stylesheet" href="https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-push-ui.css" />
</head>
<body>
<script type="module">
-  import { } from 'https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-core.js';
-  import { } from 'https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-assets.js';
-  import { } from 'https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-geo.js';
-  import { } from 'https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-in-app-messaging.js';
-  import { } from 'https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-inbox.js';
-  import { } from 'https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-push.js';
-  import { } from 'https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-push-ui.js';
-  import { } from 'https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-user-inbox.js';
+  import { } from 'https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-core.js';
+  import { } from 'https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-assets.js';
+  import { } from 'https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-geo.js';
+  import { } from 'https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-in-app-messaging.js';
+  import { } from 'https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-inbox.js';
+  import { } from 'https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-push.js';
+  import { } from 'https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-push-ui.js';
+  import { } from 'https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-user-inbox.js';

  // more code ...
</script>
</body>
</html>
```


### Configuration file

If your project uses the **managed configuration** approach — meaning it includes a `notificare-services.json` file — you must rename this file to `actito-services.json`.

### Implementation

#### Rename references

You must update all references to the old Notificare classes and packages throughout your project.
Replace any types starting with `Notificare` (for example, `NotificareNotification`, `NotificareLocation`, `NotificareDevice`, etc.) with their Actito equivalents (`ActitoNotification`, `ActitoLocation`, `ActitoDevice`, and so on).

Similarly, update all imports from `notificare-web` package to `actito-web`.

For example, here’s how marking an inbox item as read should be updated:

```diff
- import { markInboxItemAsRead, NotificareInboxItem } from 'notificare-web/inbox'
+ import { markInboxItemAsRead, ActitoInboxItem } from 'actito-web/inbox'

- async onMarkInboxItemAsRead(inboxItem: NotificareInboxItem) {
+ async onMarkInboxItemAsRead(inboxItem: ActitoInboxItem) {
    try {
        await markInboxItemAsRead(inboxItem);
    } catch {
        // ...
    }
}
```

> **Tip:**
>
> A global search-and-replace can accelerate this migration, but review your code carefully.

Override Default Theme

If your web content enforces a specific light or dark mode, you previously achieved this using the `data-notificare-theme` attribute.
In Actito, this attribute has been renamed to `data-actito-theme`.

Update your HTML accordingly:
```diff
- <html data-notificare-theme="light">
+ <html data-actito-theme="light">
    <!-- more code ... -->
</html>
```

#### Receiving Notifications

If you include the service worker file provided by us as part of your app's build procedure, you must now import it from the updated package:

```diff
- import 'notificare-web/push/sw'
+ import 'actito-web/push/sw'
```

Otherwise, if you import it directly from the CDN using the `importScripts` function, you must also use the new URL.

```diff
- importScripts('https://cdn.notifica.re/libs/web/v4/{{version}}/notificare-push-sw.js');
+ importScripts('https://cdn-mobile.actito.com/libs/web/v5/{{version}}/actito-push-sw.js');
```

#### Restricted Tag Naming

Tag naming rules have been tightened to ensure consistency.
Tags added using `addTag()` or `addTags()` must now adhere to the following constraints:

- The tag name must be between 3 and 64 characters in length.
- Tags must start and end with an alphanumeric character.
- Only letters, digits, underscores (`_`), and hyphens (`-`) are allowed within the name.

> **Example:**
>
> ✅ `premium_user`  ✅ `en-GB`  ❌ @user


#### Restricted Event Naming and Payload Size

Event naming and payload validation rules have also been standardized.
Custom events logged with `logCustom()` must comply with the following:

- Event names must be between 3 and 64 characters.
- Event names must start and end with an alphanumeric character.
- Only letters, digits, underscores (`_`), and hyphens (`-`) are permitted.
- The event data payload is limited to 2 KB in size. Ensure you are not sending excessively large or deeply nested objects when calling: `logCustom(event, data)`.

> **Tip:**
>
> To avoid exceeding the payload limit, keep your event data minimal — include only the essential key–value pairs required for personalized content or campaign targeting.

#### Ignore Non-Push Devices

Ignoring non-push devices are no longer configured through the `actito-services.json` file (previously `notificare-services.json`).
The flags `ignoreTemporaryDevices` and `ignoreUnsupportedWebPushDevices` are no longer recognized locally and have been migrated to remote configurations.

You should contact Actito to review your Web Push settings and adjust these configuration flags as needed to ensure your device registration logic behaves as expected.

> **Note:**
>
> This change centralizes Web Push behavior within Actito, allowing configuration updates without requiring an app release.
