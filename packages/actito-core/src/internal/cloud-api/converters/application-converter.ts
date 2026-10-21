import type {
  CloudApplication,
  CloudApplicationActionCategory,
  CloudApplicationActionCategoryAction,
  CloudApplicationActionCategoryActionIcon,
  CloudApplicationInboxConfig,
  CloudApplicationRegionConfig,
  CloudApplicationUserDataField,
  CloudApplicationWebsitePushConfig,
  CloudApplicationWebsitePushConfigInfo,
  CloudApplicationWebsitePushConfigLaunchConfig,
  CloudApplicationWebsitePushConfigLaunchConfigAutoOnboarding,
  CloudApplicationWebsitePushConfigLaunchConfigFloatingButton,
  CloudApplicationWebsitePushConfigVapid,
} from '@actito/web-cloud-api';
import type {
  ActitoApplication,
  ActitoApplicationActionCategory,
  ActitoApplicationActionCategoryAction,
  ActitoApplicationActionCategoryActionIcon,
  ActitoApplicationInboxConfig,
  ActitoApplicationRegionConfig,
  ActitoApplicationUserDataField,
  ActitoApplicationWebsitePushConfig,
  ActitoApplicationWebsitePushConfigInfo,
  ActitoApplicationWebsitePushConfigLaunchConfig,
  ActitoApplicationWebsitePushConfigLaunchConfigAutoOnboardingOptions,
  ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonOptions,
  ActitoApplicationWebsitePushConfigVapid,
} from '~/models/actito-application';

export function convertCloudApplicationToPublic(application: CloudApplication): ActitoApplication {
  return {
    id: application._id,
    name: application.name,
    category: application.category,
    services: application.services ?? {},
    inboxConfig: convertInboxConfigToPublic(application.inboxConfig),
    regionConfig: convertRegionConfigToPublic(application.regionConfig),
    websitePushConfig: convertWebsitePushConfigToPublic(application.websitePushConfig),
    userDataFields: convertUserDataFieldsToPublic(application.userDataFields),
    actionCategories: convertActionCategoriesToPublic(application.actionCategories),
    enforceSizeLimit: application.enforceSizeLimit,
    enforceTagRestrictions: application.enforceTagRestrictions,
    enforceEventNameRestrictions: application.enforceEventNameRestrictions,
  };
}

function convertInboxConfigToPublic(
  inboxConfig: CloudApplicationInboxConfig | undefined,
): ActitoApplicationInboxConfig | undefined {
  if (!inboxConfig) return undefined;

  return {
    useInbox: inboxConfig.useInbox ?? false,
    useUserInbox: inboxConfig.useUserInbox ?? false,
    autoBadge: inboxConfig.autoBadge ?? false,
  };
}

function convertRegionConfigToPublic(
  regionConfig: CloudApplicationRegionConfig | undefined,
): ActitoApplicationRegionConfig | undefined {
  if (!regionConfig?.proximityUUID) return undefined;

  return {
    proximityUUID: regionConfig.proximityUUID,
  };
}

function convertWebsitePushConfigToPublic(
  websitePushConfig: CloudApplicationWebsitePushConfig | undefined,
): ActitoApplicationWebsitePushConfig | undefined {
  if (!websitePushConfig?.icon || !websitePushConfig?.allowedDomains) {
    return undefined;
  }

  return {
    icon: websitePushConfig.icon,
    allowedDomains: websitePushConfig.allowedDomains,
    urlFormatString: websitePushConfig.urlFormatString,
    info: convertWebsitePushConfigInfoToPublic(websitePushConfig.info),
    vapid: convertWebsitePushConfigVapidToPublic(websitePushConfig.vapid),
    launchConfig: convertWebsitePushConfigLaunchConfigToPublic(websitePushConfig.launchConfig),
    ignoreTemporaryDevices: websitePushConfig.ignoreTemporaryDevices,
    ignoreUnsupportedWebPushDevices: websitePushConfig.ignoreUnsupportedWebPushDevices,
  };
}

function convertWebsitePushConfigInfoToPublic(
  info: CloudApplicationWebsitePushConfigInfo | undefined,
): ActitoApplicationWebsitePushConfigInfo | undefined {
  if (
    !info?.subject?.UID ||
    !info?.subject?.CN ||
    !info?.subject?.OU ||
    !info?.subject?.O ||
    !info?.subject?.C
  ) {
    return undefined;
  }

  return {
    subject: {
      UID: info.subject.UID,
      CN: info.subject.CN,
      OU: info.subject.OU,
      O: info.subject.O,
      C: info.subject.C,
    },
  };
}

function convertWebsitePushConfigVapidToPublic(
  vapid: CloudApplicationWebsitePushConfigVapid | undefined,
): ActitoApplicationWebsitePushConfigVapid | undefined {
  if (!vapid?.publicKey) return undefined;

  return {
    publicKey: vapid.publicKey,
  };
}

function convertWebsitePushConfigLaunchConfigToPublic(
  launchConfig: CloudApplicationWebsitePushConfigLaunchConfig | undefined,
): ActitoApplicationWebsitePushConfigLaunchConfig | undefined {
  if (!launchConfig) return undefined;

  const autoOnboardingOptions = convertLaunchConfigAutoOnboardingToPublic(
    launchConfig.autoOnboardingOptions,
  );

  const floatingButtonOptions = convertLaunchConfigFloatingButtonToPublic(
    launchConfig.floatingButtonOptions,
  );

  if (!autoOnboardingOptions && !floatingButtonOptions) return undefined;

  return {
    applicationName: launchConfig.applicationName,
    autoOnboardingOptions,
    floatingButtonOptions,
  };
}

function convertLaunchConfigAutoOnboardingToPublic(
  autoOnboarding: CloudApplicationWebsitePushConfigLaunchConfigAutoOnboarding | undefined,
): ActitoApplicationWebsitePushConfigLaunchConfigAutoOnboardingOptions | undefined {
  if (
    !autoOnboarding ||
    !autoOnboarding.message ||
    !autoOnboarding.acceptButton ||
    !autoOnboarding.cancelButton
  ) {
    return undefined;
  }

  return {
    message: autoOnboarding.message,
    acceptButton: autoOnboarding.acceptButton,
    cancelButton: autoOnboarding.cancelButton,
    retryAfterHours: autoOnboarding.retryAfterHours,
    showAfterSeconds: autoOnboarding.showAfterSeconds,
  };
}

function convertLaunchConfigFloatingButtonToPublic(
  floatingButton: CloudApplicationWebsitePushConfigLaunchConfigFloatingButton | undefined,
): ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonOptions | undefined {
  if (
    !floatingButton ||
    !floatingButton.alignment?.horizontal ||
    !floatingButton.alignment?.vertical ||
    !floatingButton.permissionTexts?.default ||
    !floatingButton.permissionTexts?.granted ||
    !floatingButton.permissionTexts?.denied
  ) {
    return undefined;
  }

  return {
    alignment: {
      horizontal: floatingButton.alignment.horizontal,
      vertical: floatingButton.alignment.vertical,
    },
    permissionTexts: {
      default: floatingButton.permissionTexts.default,
      granted: floatingButton.permissionTexts.granted,
      denied: floatingButton.permissionTexts.denied,
    },
  };
}

function convertUserDataFieldsToPublic(
  userDataFields: CloudApplicationUserDataField[] | undefined,
): ActitoApplicationUserDataField[] {
  if (!userDataFields) return [];

  const result: ActitoApplicationUserDataField[] = [];
  userDataFields.forEach((userDataField) => {
    if (!userDataField || !userDataField.type || !userDataField.key || !userDataField.label) return;

    result.push({
      type: userDataField.type,
      key: userDataField.key,
      label: userDataField.label,
    });
  });

  return result;
}

function convertActionCategoriesToPublic(
  actionCategories: CloudApplicationActionCategory[] | undefined,
): ActitoApplicationActionCategory[] {
  if (!actionCategories) return [];

  const result: ActitoApplicationActionCategory[] = [];
  actionCategories.forEach((actionCategory) => {
    if (!actionCategory || !actionCategory.type || !actionCategory.name) return;

    result.push({
      type: actionCategory.type,
      name: actionCategory.name,
      description: actionCategory.description,
      actions: convertActionCategoriesActionsToPublic(actionCategory.actions),
    });
  });

  return result;
}

function convertActionCategoriesActionsToPublic(
  actions: CloudApplicationActionCategoryAction[] | undefined,
): ActitoApplicationActionCategoryAction[] {
  if (!actions) return [];

  const result: ActitoApplicationActionCategoryAction[] = [];
  actions.forEach((action) => {
    if (!action.label) return;

    result.push({
      id: action._id,
      type: action.type,
      label: action.label,
      target: action.target,
      camera: action.camera ?? false,
      keyboard: action.keyboard ?? false,
      destructive: action.destructive,
      icon: convertActionCategoriesActionIconToPublic(action.icon),
    });
  });

  return result;
}

function convertActionCategoriesActionIconToPublic(
  icon: CloudApplicationActionCategoryActionIcon | undefined,
): ActitoApplicationActionCategoryActionIcon | undefined {
  if (!icon) return undefined;
  if (!icon.android && !icon.ios && !icon?.web) return undefined;

  return {
    android: icon.android,
    ios: icon.ios,
    web: icon.web,
  };
}
