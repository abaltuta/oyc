export const httpMethods = ["get", "post", "put", "patch", "delete", "head"];

export const methodSelector = httpMethods
  .flatMap((method) => [`[oyc-${method}]`, `[data-oyc-${method}]`])
  .join(",");

export const ignoreAttribute = "oyc-ignore";

export const oycAttributes = ["oyc-trigger"];

export const oycAttributeSelector = oycAttributes
  .flatMap((attribute) => [`[${attribute}]`, `[data-${attribute}]`])
  .join(",");