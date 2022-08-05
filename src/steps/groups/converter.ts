import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { SonarCloudUserGroup } from '../../types';
import { Entities } from '../constants';

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
        memberCount: group.membersCount,
        default: group.default,
      },
    },
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
