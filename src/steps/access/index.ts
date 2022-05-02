import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationMissingKeyError,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { SonarCloudUserGroup } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Steps, Relationships } from '../constants';
import {
  createAccountOrganizationRelationship,
  createAccountUserRelationship,
  createGroupEntity,
  createGroupUserRelationship,
  createOrganizationEntity,
  createOrganizationGroupRelationship,
  createUserEntity,
  getOrganizationKey,
  getUserKey,
} from './converter';

export async function fetchOrganizations({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateOrganizations(async (organization) => {
    await jobState.addEntity(createOrganizationEntity(organization));
  });
}

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateOrganizations(async (organization) => {
    await apiClient.iterateOrganizationUsers(organization, async (user) => {
      const userEntity = await jobState.addEntity(createUserEntity(user));

      await jobState.addRelationship(
        createAccountUserRelationship(accountEntity, userEntity),
      );
    });
  });
}

export async function fetchGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateOrganizations(async (organization) => {
    const organizationKey = getOrganizationKey(organization);
    const organizationEntity = await jobState.findEntity(organizationKey);

    if (!organizationEntity) {
      throw new IntegrationMissingKeyError(
        `Expected organization with key to exist (key=${organizationKey})`,
      );
    }

    await apiClient.iterateOrganizationGroups(organization, async (group) => {
      const groupEntity = await jobState.addEntity(createGroupEntity(group));

      await jobState.addRelationship(
        createOrganizationGroupRelationship(organizationEntity, groupEntity),
      );
    });
  });
}

export async function buildAccountOrganizationRelationships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateOrganizations(async (organization) => {
    const organizationKey = getOrganizationKey(organization);
    const organizationEntity = await jobState.findEntity(organizationKey);

    if (!organizationEntity) {
      throw new IntegrationMissingKeyError(
        `Expected organization with key to exist (key=${organizationKey})`,
      );
    }

    await jobState.addRelationship(
      createAccountOrganizationRelationship(accountEntity, organizationEntity),
    );
  });
}

export async function buildGroupUserRelationships({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.GROUP._type },
    async (groupEntity) => {
      const group = getRawData<SonarCloudUserGroup>(groupEntity);

      if (!group) {
        logger.warn(
          { _key: groupEntity._key },
          'Could not get raw data for group entity',
        );
        return;
      }

      await apiClient.iterateGroupUsers(group.id, async (user) => {
        const userEntityKey = getUserKey(user.login);
        const userEntity = await jobState.findEntity(userEntityKey);

        if (!userEntity) {
          throw new IntegrationMissingKeyError(
            `Expected user with key to exist (key=${userEntityKey})`,
          );
        }

        await jobState.addRelationship(
          createGroupUserRelationship(groupEntity, userEntity),
        );
      });
    },
  );
}

export const accessSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ORGANIZATIONS,
    name: 'Fetch Organizations',
    entities: [Entities.ORGANIZATION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOrganizations,
  },
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.GROUPS,
    name: 'Fetch Groups',
    entities: [Entities.GROUP],
    relationships: [Relationships.ORGANIZATION_HAS_GROUP],
    dependsOn: [Steps.ORGANIZATIONS],
    executionHandler: fetchGroups,
  },
  {
    id: Steps.ACCOUNT_ORGANIZATION_RELATIONSHIPS,
    name: 'Build Account -> Organization Relationships',
    entities: [],
    relationships: [Relationships.ACCOUNT_HAS_ORGANIZATION],
    dependsOn: [Steps.ACCOUNT, Steps.ORGANIZATIONS],
    executionHandler: buildAccountOrganizationRelationships,
  },
  {
    id: Steps.GROUP_USER_RELATIONSHIPS,
    name: 'Build Group -> User Relationships',
    entities: [],
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [Steps.GROUPS, Steps.USERS],
    executionHandler: buildGroupUserRelationships,
  },
];
