import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { SonarCloudProject } from '../../types';
import { Entities } from '../constants';

export function createProjectEntity(project: SonarCloudProject): Entity {
  const id = `sonarcloud_project:${project.key}`;

  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _type: Entities.PROJECT._type,
        _class: Entities.PROJECT._class,
        _key: id,
        key: project.name,
        name: project.name,
        visibility: project.visibility,
      },
    },
  });
}

export function createOrganizationProjectRelationship(
  organization: Entity,
  project: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: organization,
    to: project,
  });
}
