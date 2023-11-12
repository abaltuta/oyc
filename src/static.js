export const httpMethods = ["get", "post", "put", "patch", "delete", "head"];

export const methodSelector = httpMethods
  .flatMap((method) => [`[oyc-${method}]`, `[data-oyc-${method}]`])
  .join(",");

export const oycAttributes = ["trigger"];

export const oycAttributeSelector = oycAttributes
  .flatMap((attribute) => [`[oyc-${attribute}]`, `[data-oyc-${attribute}]`])
  .join(",");