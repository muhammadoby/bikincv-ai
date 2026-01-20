import path from "node:path";
import url from "node:url";

export default {
  // path: __dirname + "/../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + "/../", // for AdonisJS v6
  title: "BikinCV REST API", // use info instead
  version: "1.0.0", // use info instead
  description: "REST API Documentation for BikinCV", // use info instead
  tagIndex: 2,
  productionEnv: "production", // optional
  info: {
    title: "BikinCV REST API",
    version: "1.0.0",
    description: "REST API Documentation for BikinCV",
  },
  snakeCase: true,

  debug: true, // set to true, to get some useful debug output
  ignore: ["/swagger", "/docs", "/uploads/*"],
  preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {}, // optional
  authMiddlewares: ["auth", "auth:api"], // optional
  defaultSecurityScheme: "BearerAuth", // optional
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary
};
