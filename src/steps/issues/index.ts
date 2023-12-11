import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createProjectIssueRelationship, createIssueEntity } from './converter';

export async function fetchIssues({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    {
      _type: Entities.PROJECT._type,
    },
    async (projectEntity) => {
      const projectKey = projectEntity.key;

      await apiClient.iterateProjectIssues(
        projectKey as string,
        async (issue) => {
          logger.info('Ingested a SonarCloud Issue: ', issue.key);

          const issueEntity = await jobState.addEntity(
            createIssueEntity(issue),
          );

          logger.info(
            'Adding a sonarcloud_issue entity to jobState',
            issueEntity._key,
          );

          await jobState.addRelationship(
            createProjectIssueRelationship(projectEntity, issueEntity),
          );
        },
      );
    },
  );
}

export const issuesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ISSUES,
    name: 'Fetch Issues',
    entities: [Entities.ISSUE],
    relationships: [Relationships.PROJECT_HAS_ISSUE],
    dependsOn: [Steps.ORGANIZATIONS, Steps.PROJECTS],
    executionHandler: fetchIssues,
  },
];
