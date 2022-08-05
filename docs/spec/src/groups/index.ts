import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const groupSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://sonarcloud.io/api/user_groups/search?organization=<name>
     * PATTERN: Fetch Entities
     */
    id: 'fetch-groups',
    name: 'Fetch Groups',
    entities: [
      {
        resourceName: 'UserGroup',
        _type: 'sonarcloud_group',
        _class: ['UserGroup'],
      },
    ],
    relationships: [
      {
        _type: 'sonarcloud_organization_has_group',
        sourceType: 'sonarcloud_organization',
        _class: RelationshipClass.HAS,
        targetType: 'sonarcloud_group',
      },
    ],
    dependsOn: ['fetch-organizations'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-group-user-relationships',
    name: 'Build Group -> User Relationships',
    entities: [],
    relationships: [
      {
        _type: 'sonarcloud_group_has_user',
        sourceType: 'sonarcloud_group',
        _class: RelationshipClass.HAS,
        targetType: 'sonarcloud_user',
      },
    ],
    dependsOn: ['fetch-groups', 'fetch-users'],
    implemented: true,
  },
];
