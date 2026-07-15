import baseaDataConfig from '@basea-layer/schemas';
import teqcitiDataConfig from '@teqciti-layer/schemas';

const dataConfig = {
  ...baseaDataConfig,
  ...teqcitiDataConfig
};

// Export it as the default.
export default dataConfig;
