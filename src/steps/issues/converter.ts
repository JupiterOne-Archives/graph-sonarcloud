import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';

import { SonarCloudIssue } from '../../types';
import { Entities } from '../constants';

export function createIssueEntity(issue: SonarCloudIssue): Entity {
  const id = `sonarcloud_issue:${issue.key}`;

  return createIntegrationEntity({
    entityData: {
      source: issue,
      assign: {
        _type: Entities.ISSUE._type,
        _class: Entities.ISSUE._class,
        _key: id,
        name: issue.component,
        status: issue.status,
        severity: issue.severity,
      },
    },
  });
}

export function createProjectIssueRelationship(
  project: Entity,
  issue: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: project,
    to: issue,
  });
}
