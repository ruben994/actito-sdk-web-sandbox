/** Represents a rich asset returned by Actito.
 *
 * An {@link ActitoAsset} contains displayable content such as a title,
 * optional descriptive text, a link to a binary file, and elements like a button
 * or metadata. Additional fields are stored in {@link ActitoAsset.extra}.
 */
export interface ActitoAsset {
  /**
   * The ID of the asset
   */
  readonly id: string;

  /**
   *  The title of the asset.
   */
  readonly title: string;

  /**
   * Optional description of the asset.
   */
  readonly description?: string;

  /**
   * Optional key of the asset.
   */
  readonly key?: string;

  /**
   * Optional binary file url of the asset.
   */
  readonly url?: string;

  /**
   * Optional button associated with the asset.
   */
  readonly button?: ActitoAssetButton;

  /**
   * Optional metadata associated with the asset.
   */
  readonly metaData?: ActitoAssetMetaData;

  /**
   * Collection of key-value pairs used to add extra information to the asset.
   */
  readonly extra: Record<string, unknown>;
}

/**
 * Represents a call-to-action button associated with an {@link ActitoAsset}.
 */
export interface ActitoAssetButton {
  /**
   * Optional text displayed on the button.
   */
  readonly label?: string;

  /**
   * Optional action associated with the button.
   */
  readonly action?: string;
}

/**
 * Contains metadata describing the underlying file of an {@link ActitoAsset}.
 */
export interface ActitoAssetMetaData {
  /**
   * The original name of the file as provided at upload time.
   */
  readonly originalFileName: string;

  /**
   * The MIME type of the file.
   */
  readonly contentType: string;

  /**
   * The size of the file in bytes.
   */
  readonly contentLength: number;
}
