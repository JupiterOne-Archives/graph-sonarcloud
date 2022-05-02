import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accessSpec: StepSpec<IntegrationConfig>[] = [
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
    relationships: [
      {
        _type: 'sonarcloud_account_has_user',
        sourceType: 'sonarcloud_account',
        _class: RelationshipClass.HAS,
        targetType: 'sonarcloud_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
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
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-account-organization-relationships',
    name: 'Build Account -> Organization Relationships',
    entities: [],
    relationships: [
      {
        _type: 'sonarcloud_account_has_organization',
        sourceType: 'sonarcloud_account',
        _class: RelationshipClass.HAS,
        targetType: 'sonarcloud_organization',
      },
    ],
    dependsOn: ['fetch-account', 'fetch-organizations'],
    implemented: true,
  },
];
