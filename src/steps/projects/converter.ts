import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
  parseTimePropertyValue,
  createMappedRelationship,
  RelationshipDirection,
  MappedRelationship,
} from '@jupiterone/integration-sdk-core';

import { SonarCloudProject } from '../../types';
import { Entities, MappedRelationships } from '../constants';

export function createProjectEntity(project: SonarCloudProject): Entity {
  const id = `sonarcloud_project:${project.key}`;

  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _type: Entities.PROJECT._type,
        _class: Entities.PROJECT._class,
        _key: id,
        key: project.key,
        name: project.name,
        public: project.visibility === 'public',
        qualifier: project.qualifier,
        organization: project.organization,
        lastAnalysisDate: parseTimePropertyValue(project.lastAnalysisDate),
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

export function buildProjectRepoMappedRelationship(
  projectEntity: Entity,
): MappedRelationship | undefined {
  const repoName = projectEntity.name as string | undefined;
  const projectOrganization = projectEntity.organization as string | undefined;

  if (projectEntity.name && projectEntity.organization) {
    return createMappedRelationship({
      _class: RelationshipClass.SCANS,
      _type: MappedRelationships.PROJECT_SCANS_CODEREPO._type,
      _mapping: {
        relationshipDirection: RelationshipDirection.FORWARD,
        sourceEntityKey: projectEntity._key,
        targetFilterKeys: [['_class', 'name', 'owner']],
        targetEntity: {
          _class: 'CodeRepo',
          name: repoName,
          owner: projectOrganization,
        },
        skipTargetCreation: true,
      },
    });
  }
}
