/**
 * Individual credential configuration item
 */
export interface Credential {
  integrationConfigurationAssignmentID: number;
  masterIntegrationID: number;
  configTemplateName: "API" | "SFTP" | string;
  configType: string;
  configKey: string;
  configValue: string;
  controlType: string;
  isRequired: boolean;
  additionalValue: string | null;
  defaultValue: string;
  environmentType: string;
  direction?: "InBound" | "OutBound";
}

/**
 * Credential data structure from API response
 */
export interface CredentialData {
  credentials: Credential[];
}

/**
 * Full API response structure for getCredentials
 */
export interface CredentialResponse {
  data: CredentialData;
  message: string;
  status: string;
  httpStatusCode: number;
  error: string | null;
}

/**
 * Payload structure for POST/PUT credential requests
 */
export interface CredentialPayload {
  configValue: string;
  defaultValue: string;
  configKey: string;
  masterIntegrationID: number;
  configTemplateName: string;
  configType: string;
  controlType: string;
  isRequired: boolean;
  environmentType: string;
  additionalValue: string | null;
  direction?: "InBound" | "OutBound";
}
