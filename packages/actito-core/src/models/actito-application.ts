/**
 * Represents an Actito application.
 *
 * An {@link ActitoApplication} describes the capabilities, services, and configuration
 * of an application as defined in Actito. It includes enabled services, region
 * inbox, and websitePush configuration, available user data fields, and supported action categories.
 */
export interface ActitoApplication {
  /**
   * Unique identifier of the application.
   */
  readonly id: string;

  /**
   * Name of the application.
   */
  readonly name: string;

  /**
   * Category of the application.
   */
  readonly category: string;

  /**
   * Map of enabled services for the application.
   */
  readonly services: Record<string, boolean>;

  /**
   * Optional inbox-related configuration.
   */
  readonly inboxConfig?: ActitoApplicationInboxConfig;

  /**
   * Optional region-related configuration.
   */
  readonly regionConfig?: ActitoApplicationRegionConfig;

  /**
   * Optional website push related configuration.
   */
  readonly websitePushConfig?: ActitoApplicationWebsitePushConfig;

  /**
   * List of user data fields supported by the application.
   */
  readonly userDataFields: ActitoApplicationUserDataField[];

  /**
   * List of action categories available in the application.
   */
  readonly actionCategories: ActitoApplicationActionCategory[];

  /**
   * Indicates whether event payloads must respect a maximum size limit.
   */
  readonly enforceSizeLimit?: boolean;

  /**
   * Indicates whether tag names must comply with predefined restrictions.
   */
  readonly enforceTagRestrictions?: boolean;

  /**
   * Indicates whether event names must comply with predefined naming rules.
   */
  readonly enforceEventNameRestrictions?: boolean;
}

/**
 * Configuration related to inbox-based features.
 */
export interface ActitoApplicationInboxConfig {
  /**
   * Whether the inbox feature is enabled for the application.
   */
  readonly useInbox: boolean;

  /**
   * Whether the user inbox feature is enabled for the application.
   */
  readonly useUserInbox: boolean;

  /**
   * Whether inbox messages should automatically update the application
   * badge count.
   */
  readonly autoBadge: boolean;
}

/**
 * Configuration related to region-based features.
 */
export interface ActitoApplicationRegionConfig {
  /**
   * Optional UUID used for beacon detection.
   */
  readonly proximityUUID?: string;
}

/**
 * Configuration related to website push features.
 */
export interface ActitoApplicationWebsitePushConfig {
  /**
   * Icon to be displayed when presenting push notifications.
   */
  readonly icon: string;

  /**
   * Domains allowed to use website push.
   */
  readonly allowedDomains: string[];

  /**
   * When using Safari Website Push, this is the page users will land when
   * clicking a notification. Should include a placeholder for the notification
   * identifier.
   */
  readonly urlFormatString?: string;

  /**
   * Configuration information of Safari Website Push.
   */
  readonly info?: ActitoApplicationWebsitePushConfigInfo;

  /**
   * VAPID website push configuration.
   */
  readonly vapid?: ActitoApplicationWebsitePushConfigVapid;

  /**
   * Website Push pre-permission prompt configuration.
   */
  readonly launchConfig?: ActitoApplicationWebsitePushConfigLaunchConfig;

  /**
   * Indicates whether to prevent the registration of devices that do not
   * grant permissions for website push notifications.
   *
   * If `true`, those devices will be ignored.
   */
  readonly ignoreTemporaryDevices?: boolean;

  /**
   * Indicates whether to prevent the registration of devices that are not
   * capable of receiving remote notifications.
   *
   * If `true`, those devices will be ignored.
   */
  readonly ignoreUnsupportedWebPushDevices?: boolean;
}

/**
 * Configuration information of Safari Website Push.
 */
export interface ActitoApplicationWebsitePushConfigInfo {
  readonly subject: {
    readonly UID: string;
    readonly CN: string;
    readonly OU: string;
    readonly O: string;
    readonly C: string;
  };
}

/**
 * VAPID website push configuration containing the public key.
 */
export interface ActitoApplicationWebsitePushConfigVapid {
  /**
   * The VAPID public key.
   */
  readonly publicKey: string;
}

/**
 * Website Push pre-permission prompt configuration.
 */
export interface ActitoApplicationWebsitePushConfigLaunchConfig {
  /**
   * Optional name of the application to be shown.
   */
  readonly applicationName?: string;

  /**
   * Optional configuration for a website push opt-in dialog.
   */
  readonly autoOnboardingOptions?: ActitoApplicationWebsitePushConfigLaunchConfigAutoOnboardingOptions;

  /**
   * Optional configuration for a website push opt-in floating action button.
   */
  readonly floatingButtonOptions?: ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonOptions;
}

/**
 * Configuration for the website push opt-in dialog.
 */
export interface ActitoApplicationWebsitePushConfigLaunchConfigAutoOnboardingOptions {
  /**
   * Text to be shown in the dialog window.
   */
  readonly message: string;

  /**
   * Text to be shown in cancel button.
   */
  readonly cancelButton: string;

  /**
   * Text to be shown in accept button.
   */
  readonly acceptButton: string;

  /**
   * Optional time period after which the opt-in prompt will be re-shown, in hours.
   */
  readonly retryAfterHours?: number;

  /**
   * Optional delay before the opt-in prompt is shown, in seconds.
   */
  readonly showAfterSeconds?: number;
}

/**
 * Configuration for the website push opt-in floating action button.
 */
export interface ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonOptions {
  /**
   * The alignment of the floating action button.
   */
  readonly alignment: {
    /**
     * Horizontal alignment of the floating action button.
     */
    readonly horizontal: ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonHorizontalAlignment;

    /**
     * Vertical alignment of the floating action button.
     */
    readonly vertical: ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonVerticalAlignment;
  };

  /**
   * Text to be shown when the user hovers the floating action button.
   */
  readonly permissionTexts: ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonPermissionTexts;
}

/**
 * Horizontal alignment of the floating action button.
 *
 * - `'start'`- Start of the website.
 * - `'center'`- Center of the website.
 * - `'end'`- End of the website.
 */
export type ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonHorizontalAlignment =
  | 'start'
  | 'center'
  | 'end'
  | string;

/**
 * - `'top'`- Top of the website.
 * - `'center'`- Center of the website.
 * - `'bottom'`- Bottom of the website.
 */
export type ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonVerticalAlignment =
  | 'top'
  | 'center'
  | 'bottom'
  | string;

/**
 * Text to be shown when the user hovers the floating action button.
 */
export interface ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonPermissionTexts {
  /**
   * Text shown when the user hovers and permission has not yet be granted or denied.
   */
  readonly default: string;

  /**
   * Text shown when the user hovers and permission has been granted.
   */
  readonly granted: string;

  /**
   * Text shown when the user hovers and permission has been denied.
   */
  readonly denied: string;
}

/**
 * Describes a user data field supported by an Actito application.
 *
 * User data fields define the structure of user attributes that can be
 * stored and leveraged for segmentation or personalization.
 */
export interface ActitoApplicationUserDataField {
  /**
   * The data type of the field.
   */
  readonly type: string;

  /**
   * The unique key identifying the field.
   */
  readonly key: string;

  /**
   * Human-readable label for the field.
   */
  readonly label: string;
}

/**
 * Groups related actions that can be triggered from notifications
 * or other engagement mechanisms.
 */
export interface ActitoApplicationActionCategory {
  /**
   * The category type identifier.
   */
  readonly type: string;

  /**
   * The name of the action category.
   */
  readonly name: string;

  /**
   * Optional description explaining the purpose of the category.
   */
  readonly description?: string;

  /**
   * List of actions belonging to this category.
   */
  readonly actions: ActitoApplicationActionCategoryAction[];
}

/**
 * Action belonging to an Action Category.
 */
export interface ActitoApplicationActionCategoryAction {
  /**
   * The ID of the action.
   */
  readonly id: string;

  /**
   * Type of the action.
   */
  readonly type: string;

  /**
   * User-visible label of the action.
   */
  readonly label: string;

  /**
   * Optional target associated with the action.
   */
  readonly target?: string;

  /**
   * Whether the action requires keyboard input.
   */
  readonly keyboard: boolean;

  /**
   * Whether the action requires camera access.
   */
  readonly camera: boolean;

  /**
   * Whether the action is destructive.
   */
  readonly destructive?: boolean;

  /**
   * Optional platform-specific icon configuration for the action.
   */
  readonly icon?: ActitoApplicationActionCategoryActionIcon;
}

/**
 * Icon belonging to an Action Category Action.
 */
export interface ActitoApplicationActionCategoryActionIcon {
  /**
   * Resource identifier for Android.
   */
  readonly android?: string;

  /**
   * Resource identifier for iOS.
   */
  readonly ios?: string;

  /**
   * Resource identifier for Web.
   */
  readonly web?: string;
}
