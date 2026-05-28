import { z } from 'zod';
import type { Entity } from '@data-layer/types';
import type { DirectusServiceConfig } from "@data-layer/services/directus/generic.adapter";
import { orgApiSchema, type Org } from './org.schema';

export const projectApiSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  org: z.union([z.string().uuid(), orgApiSchema]), // M2O relation
  status: z.enum(['pending', 'active', 'paused', 'completed', 'archived']),
  // M2M relation to catalog
  services_included: z.array(z.any()).nullable().optional(),
});

export type ProjectApi = z.infer<typeof projectApiSchema>;

export interface Project extends Entity {
  name: string;
  org: Org | string;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'archived';
  servicesIncluded: any[]; // Expand to Catalog array if populated
}

export const projectServiceConfig: DirectusServiceConfig<Project, ProjectApi> = {
  provider: 'primary',
  collection: 'projects',
  schema: projectApiSchema,
  mapper: (apiData): Project => {
    
    // Handle Many-to-One Organization relationship mapping
    const orgData = typeof apiData.org === 'object' && apiData.org !== null
      ? {
          id: apiData.org.id,
          name: apiData.org.name,
          status: apiData.org.status,
        } as Org 
      : apiData.org;

    // Optional: Map M2M services junction here similarly to how client_team is mapped in Org
    const mappedServices = (apiData.services_included ?? []).map(junctionItem => {
      const catalogObj = junctionItem.catalog_id || {};
      return typeof catalogObj === 'string' ? catalogObj : {
        id: catalogObj.id,
        name: catalogObj.name,
        type: catalogObj.type,
      };
    });

    return {
      id: apiData.id,
      name: apiData.name,
      org: orgData,
      status: apiData.status,
      servicesIncluded: mappedServices, 
    };
  },
};
