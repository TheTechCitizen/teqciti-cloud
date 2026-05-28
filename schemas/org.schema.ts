import { z } from 'zod';
import type { Entity } from '@data-layer/types';
import type { DirectusServiceConfig } from "@data-layer/services/directus/generic.adapter";

export const orgApiSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  status: z.enum(['Active', 'Past Client', 'Prospect', 'Onboarding']),
  logo: z.string().uuid().nullable().optional(),
  website: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  primary_contact_person: z.string().nullable().optional(),
  primary_contact_number: z.string().nullable().optional(),
  // client_team represents the M2M junction array
  client_team: z.array(z.any()).nullable().optional(),
  projects: z.array(z.union([z.string(), z.any()])).nullable().optional(),
});

export type OrgApi = z.infer<typeof orgApiSchema>;

// Represents the parsed client team member with their tenant-role
export interface ClientTeamMember {
  orgRole: string; // e.g., 'Owner', 'Admin', 'Member'
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Org extends Entity {
  name: string;
  status: 'Active' | 'Past Client' | 'Prospect' | 'Onboarding';
  logo: string | null;
  website: string | null;
  phone: string | null;
  primaryContactPerson: string | null;
  primaryContactNumber: string | null;
  clientTeam: ClientTeamMember[]; 
  projects: any[]; // Array of project IDs or mapped Project objects
}

export const orgServiceConfig: DirectusServiceConfig<Org, OrgApi> = {
  provider: 'primary',
  collection: 'org',
  schema: orgApiSchema,
  mapper: (apiData): Org => {
    
    // Cleanly map the junction table so the frontend gets a simple array of users + roles
    const mappedTeam: ClientTeamMember[] = (apiData.client_team ?? []).map(junctionItem => {
      // Directus nests the relational data inside the related collection's key (e.g., directus_users_id)
      const userObj = junctionItem.directus_users_id || {};
      return {
        orgRole: junctionItem.org_role || 'Member',
        userId: typeof userObj === 'string' ? userObj : userObj.id,
        firstName: userObj.first_name,
        lastName: userObj.last_name,
        email: userObj.email,
      };
    });

    return {
      id: apiData.id,
      name: apiData.name,
      status: apiData.status,
      logo: apiData.logo ?? null,
      website: apiData.website ?? null,
      phone: apiData.phone ?? null,
      primaryContactPerson: apiData.primary_contact_person ?? null,
      primaryContactNumber: apiData.primary_contact_number ?? null,
      clientTeam: mappedTeam,
      projects: apiData.projects ?? [],
    };
  },
};
