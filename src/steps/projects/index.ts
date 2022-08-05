import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationMissingKeyError,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { getOrganizationKey } from '../organizations/converter';
import { Entities, Relationships, Steps } from '../constants';
import {
  createOrganizationProjectRelationship,
  createProjectEntity,
} from './converter';

export async function fetchProjects({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateOrganizations(async (organization) => {
    await apiClient.iterateOrganizationProjects(
      organization,
      async (project) => {
        const organizationKey = getOrganizationKey(organization);
        const organizationEntity = await jobState.findEntity(organizationKey);

        if (!organizationEntity) {
          throw new IntegrationMissingKeyError(
            `Expected organization with key to exist (key=${organizationKey})`,
          );
        }

        const projectEntity = await jobState.addEntity(
          createProjectEntity(project),
        );

        await jobState.addRelationship(
          createOrganizationProjectRelationship(
            organizationEntity,
            projectEntity,
          ),
        );
      },
    );
  });
}

export const projectSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PROJECTS,
    name: 'Fetch Projects',
    entities: [Entities.PROJECT],
    relationships: [Relationships.ORGANIZATION_HAS_PROJECT],
    dependsOn: [Steps.ORGANIZATIONS],
    executionHandler: fetchProjects,
  },
];
