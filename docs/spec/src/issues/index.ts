import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accountSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://sonarcloud.io/api/issues/search?organization=<name>
     * PATTERN: Fetch Entities
     */
    id: 'fetch-issues',
    name: 'Fetch Issues',
    entities: [
      {
        resourceName: 'Issue',
        _type: 'sonarcloud_issue',
        _class: ['Issue'],
      },
    ],
    relationships: [
      {
        _type: 'sonarcloud_project_has_issue',
        sourceType: 'sonarcloud_project',
        _class: RelationshipClass.HAS,
        targetType: 'sonarcloud_issue',
      },
    ],
    dependsOn: ['fetch-organizations'],
    implemented: true,
  },
];
