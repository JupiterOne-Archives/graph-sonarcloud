import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://sonarcloud.io/api/organizations/search_members?organization=<name>
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'sonarcloud_user',
        _class: ['User'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
