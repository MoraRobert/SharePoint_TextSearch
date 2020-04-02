import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITextSearchProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
}
