import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { SonarCloudUser, SonarCloudUserGroup } from '../../types';
import { Entities } from '../constants';

export function getOrganizationKey(name: string): string {
  return `sonarcloud_organization:${name}`;
}

export function createOrganizationEntity(name: string): Entity {
  const id = getOrganizationKey(name);

  return createIntegrationEntity({
    entityData: {
      source: {
        id,
      },
      assign: {
        _type: Entities.ORGANIZATION._type,
        _class: Entities.ORGANIZATION._class,
        _key: id,
        name,
      },
    },
  });
}

export function getUserKey(login: string): string {
  return `sonarcloud_user:${login}`;
}

export function createUserEntity(user: SonarCloudUser): Entity {
  const id = getUserKey(user.login);

  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: id,
        username: user.login,
        name: user.name,
        active: true,
        admin: user.isOrgAdmin,
      },
    },
  });
}

export function getGroupKey(id: number): string {
  return `sonarcloud_group:${id}`;
}

export function createGroupEntity(group: SonarCloudUserGroup): Entity {
  const id = getGroupKey(group.id);

  return createIntegrationEntity({
    entityData: {
      source: group,
      assign: {
        _type: Entities.GROUP._type,
        _class: Entities.GROUP._class,
        _key: id,
        id,
        name: group.name,
        description: group.description,
      },
    },
  });
}

export function createAccountUserRelationship(
  account: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: user,
  });
}

export function createAccountOrganizationRelationship(
  account: Entity,
  organization: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: organization,
  });
}

export function createOrganizationGroupRelationship(
  organization: Entity,
  group: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: organization,
    to: group,
  });
}

export function createGroupUserRelationship(
  group: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: group,
    to: user,
  });
}
