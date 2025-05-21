/**
 * Object containing success and error message dictionaries for each language.
 */
export interface INotification {
  title: string;
  description: string;
  redirectPage: string;
  userId: number | string;
  otherDetails?: object;
}
