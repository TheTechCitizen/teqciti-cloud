import { z } from 'zod';
import type { Entity } from '../../../templates/ttc-template/data/types';
import type { DirectusServiceConfig } from "../../../templates/ttc-template/data/services/directus/generic.adapter";

export const catalogApiSchema = z.object({
  id: z.string(),
  date_created: z.string(),
  type: z.enum(['product', 'service']),
  name: z.string().min(1),
  description: z.string().min(1),
  startingPrice: z.number(),
  icon: z.string().min(1),
  colorBg: z.string().min(1),
  image: z.string().nullable(),
});

export type CatalogApi = z.infer<typeof catalogApiSchema>;

export interface Catalog extends Entity {
  type: 'product' | 'service';
  date_created: string;
  name: string;
  description: string;
  startingPrice: number;
  icon: string;
  colorBg: string;
  image: string;_
}

export const catalogServiceConfig: DirectusServiceConfig<Catalog, CatalogApi> = {
  provider: 'primary',
  collection: 'catalog',
  schema: catalogApiSchema,
  mapper: (apiData): Catalog => {
    return {
      id: apiData.id,
      type: apiData.type,
      name: apiData.name,
      description: apiData.description,
      startingPrice: apiData.startingPrice,
      icon: apiData.icon,
      colorBg: apiData.colorBg,
      image: apiData.image,
    };
  },
};
