import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
  parseTimePropertyValue,
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
        message: issue.message,
        effort: issue.effort,
        debt: issue.debt,
        createdOn: parseTimePropertyValue(issue.creationDate),
        updatedOn: parseTimePropertyValue(issue.updateDate),
        type: issue.type,
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
