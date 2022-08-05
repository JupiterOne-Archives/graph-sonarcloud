import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: N/A
     * PATTERN: Fetch Entities
     */
    id: 'fetch-organizations',
    name: 'Fetch Organizations',
    entities: [
      {
        resourceName: 'Organization',
        _type: 'sonarcloud_organization',
        _class: ['Organization'],
      },
    ],
    relationships: [],
    dependsOn: [],
    implemented: true,
  },
];
