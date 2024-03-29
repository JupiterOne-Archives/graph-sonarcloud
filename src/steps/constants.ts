import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  ORGANIZATIONS: 'fetch-organizations',
  USERS: 'fetch-users',
  GROUPS: 'fetch-groups',
  PROJECTS: 'fetch-projects',
  ISSUES: 'fetch-issues',
  GROUP_USER_RELATIONSHIPS: 'build-group-user-relationships',
  ACCOUNT_ORGANIZATION_RELATIONSHIPS:
    'build-account-organization-relationships',
  ORGANIZATION_GROUP_RELATIONSHIPS: 'build-organization-group-relationships',
};

export const Entities: Record<
  | 'ACCOUNT'
  | 'ORGANIZATION'
  | 'GROUP'
  | 'USER'
  | 'PROJECT'
  | 'ISSUE'
  | 'CODEREPO',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'sonarcloud_account',
    _class: ['Account'],
    schema: {
      properties: {
        mfaEnabled: { type: 'boolean' },
      },
      required: ['mfaEnabled'],
    },
  },
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'sonarcloud_organization',
    _class: ['Organization'],
    schema: {
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
  },
  GROUP: {
    resourceName: 'UserGroup',
    _type: 'sonarcloud_group',
    _class: ['UserGroup'],
    schema: {
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        membersCount: { type: 'number' },
        default: { type: 'boolean' },
      },
      required: ['name'],
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'sonarcloud_user',
    _class: ['User'],
    schema: {
      properties: {
        username: { type: 'string' },
        name: { type: 'string' },
        active: { type: 'boolean' },
        organizationAdmin: { type: 'boolean' },
      },
      required: ['username', 'name', 'active', 'organizationAdmin'],
    },
  },
  PROJECT: {
    resourceName: 'Project',
    _type: 'sonarcloud_project',
    _class: ['Project'],
    schema: {
      properties: {
        key: { type: 'string' },
        name: { type: 'string' },
        public: { type: 'boolean' },
        qualifier: { type: 'string' },
        lastAnalysisDate: { type: 'number' },
      },
      required: ['key', 'name', 'public'],
    },
  },
  ISSUE: {
    resourceName: 'Issue',
    _type: 'sonarcloud_issue',
    _class: ['Issue'],
    schema: {
      properties: {
        status: { type: 'string' },
        severity: { type: 'string' },
        message: { type: 'string' },
        effort: { type: 'string' },
        debt: { type: 'string' },
        createdOn: { type: 'number' },
        updatedOn: { type: 'number' },
        type: { type: 'string' },
      },
      required: ['status', 'severity'],
    },
  },
  CODEREPO: {
    resourceName: 'Code Repo',
    _type: 'CodeRepo',
    _class: ['CodeRepo'],
    schema: {},
  },
};

export const Relationships: Record<
  | 'GROUP_HAS_USER'
  | 'ORGANIZATION_HAS_GROUP'
  | 'ORGANIZATION_HAS_PROJECT'
  | 'PROJECT_HAS_ISSUE',
  StepRelationshipMetadata
> = {
  GROUP_HAS_USER: {
    _type: 'sonarcloud_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ORGANIZATION_HAS_GROUP: {
    _type: 'sonarcloud_organization_has_group',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  ORGANIZATION_HAS_PROJECT: {
    _type: 'sonarcloud_organization_has_project',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PROJECT._type,
  },
  PROJECT_HAS_ISSUE: {
    _type: 'sonarcloud_project_has_issue',
    sourceType: Entities.PROJECT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ISSUE._type,
  },
};

export const MappedRelationships: Record<
  'PROJECT_SCANS_CODEREPO',
  StepMappedRelationshipMetadata
> = {
  PROJECT_SCANS_CODEREPO: {
    _type: 'sonarcloud_project_scans_coderepo',
    sourceType: Entities.PROJECT._type,
    _class: RelationshipClass.SCANS,
    targetType: Entities.CODEREPO._type,
    direction: RelationshipDirection.FORWARD,
  },
};
