import { orgServiceConfig } from "./org.schema";
import { catalogServiceConfig } from "./catalog.schema";
import { projectServiceConfig } from "./project.schema";

const dataConfig = {
  org: orgServiceConfig,
  catalog: catalogServiceConfig,
  projects: projectServiceConfig,
};

// Export it as the default.
export default dataConfig;

