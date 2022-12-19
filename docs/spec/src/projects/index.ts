import {
  RelationshipClass,
  RelationshipDirection,
  StepSpec,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const projectSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://sonarcloud.io/api/projects/search?organization=<name>
     * PATTERN: Fetch Entities
     */
    id: 'fetch-projects',
    name: 'Fetch Projects',
    entities: [
      {
        resourceName: 'Project',
        _type: 'sonarcloud_project',
        _class: ['Project'],
      },
    ],
    relationships: [
      {
        _type: 'sonarcloud_organization_has_project',
        sourceType: 'sonarcloud_organization',
        _class: RelationshipClass.HAS,
        targetType: 'sonarcloud_project',
      },
    ],
    mappedRelationships: [
      {
        _type: 'sonarcloud_project_scans_coderepo',
        sourceType: 'sonarcloud_project',
        _class: RelationshipClass.SCANS,
        targetType: 'CodeRepo',
        direction: RelationshipDirection.FORWARD,
      },
    ],
    dependsOn: ['fetch-organizations'],
    implemented: true,
  },
];
