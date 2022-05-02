import fetch from 'node-fetch';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { retry } from '@lifeomic/attempt';

import { IntegrationConfig } from './config';
import {
  Pageable,
  PageableV2,
  SonarCloudAuthResponse,
  SonarCloudGroupUsersResponse,
  SonarCloudIssue,
  SonarCloudIssuesResponse,
  SonarCloudProject,
  SonarCloudProjectsResponse,
  SonarCloudUser,
  SonarCloudUserGroup,
  SonarCloudUserGroupsResponse,
  SonarCloudUsersResponse,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private withBaseUri = (path: string) => `https://sonarcloud.io/api${path}`;

  public async verifyAuthentication(): Promise<void> {
    const response = await fetch(this.withBaseUri('/authentication/validate'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${this.config.clientSecret}:`,
        ).toString('base64')}`,
      },
    });

    const body: SonarCloudAuthResponse = await response.json();

    if (!response.ok || !body.valid) {
      throw new IntegrationProviderAuthenticationError({
        cause: new Error('Provider authentication failed'),
        endpoint: this.withBaseUri('/authentication/validate'),
        status: 401,
        statusText: 'Unauthorized',
      });
    }
  }

  private async getRequest<T>(endpoint: string): Promise<T> {
    try {
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.config.clientSecret}:`,
          ).toString('base64')}`,
        },
      };

      const response = await retry(async () => await fetch(endpoint, options), {
        delay: 5000,
        maxAttempts: 10,
        handleError: (err, context) => {
          if (
            err.statusCode !== 429 ||
            ([500, 502, 503].includes(err.statusCode) && context.attemptNum > 1)
          )
            context.abort();
        },
      });

      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async paginatedGetRequest<S extends Pageable | PageableV2, T>(
    endpoint: string,
    resourceGetter: (response: S) => T[],
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let proceed = false;
    let page = 1;

    try {
      do {
        const response = await this.getRequest<S>(
          `${this.withBaseUri(endpoint)}&p=${page}`,
        );

        for (const user of resourceGetter(response)) {
          await iteratee(user);
        }

        if (
          (response as any).p &&
          (response as any).ps &&
          (response as any).total
        ) {
          const actualResponse = response as PageableV2;

          proceed = actualResponse.p * actualResponse.ps < actualResponse.total;
        } else {
          const actualResponse = response as Pageable;

          proceed =
            actualResponse.paging.pageIndex * actualResponse.paging.pageSize <
            actualResponse.paging.total;
        }

        page++;
      } while (proceed);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  /**
   * Iterates each organization in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateOrganizations(
    iteratee: ResourceIteratee<string>,
  ): Promise<void> {
    for (const organization of this.config.clientOrganizations
      .trim()
      .split(',')) {
      await iteratee(organization.trim());
    }
  }

  /**
   * Iterates each user from the provided organization.
   *
   * @param organization the organization from which to iterate users
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateOrganizationUsers(
    organization: string,
    iteratee: ResourceIteratee<SonarCloudUser>,
  ): Promise<void> {
    await this.paginatedGetRequest<SonarCloudUsersResponse, SonarCloudUser>(
      `/organizations/search_members?organization=${organization}`,
      (res) => res.users,
      iteratee,
    );
  }

  /**
   * Iterates each user from the provided group.
   *
   * @param groupId the group from which to iterate users
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroupUsers(
    groupId: number,
    iteratee: ResourceIteratee<SonarCloudUser>,
  ): Promise<void> {
    await this.paginatedGetRequest<
      SonarCloudGroupUsersResponse,
      SonarCloudUser
    >(`/user_groups/users?id=${groupId}`, (res) => res.users, iteratee);
  }

  /**
   * Iterates each group group from the provided organization.
   *
   * @param organization the organization from which to iterate groups
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateOrganizationGroups(
    organization: string,
    iteratee: ResourceIteratee<SonarCloudUserGroup>,
  ): Promise<void> {
    await this.paginatedGetRequest<
      SonarCloudUserGroupsResponse,
      SonarCloudUserGroup
    >(
      `/user_groups/search?organization=${organization}`,
      (res) => res.groups,
      iteratee,
    );
  }

  /**
   * Iterates each project resource belonging to provided organization.
   *
   * @param organization the organization from which to iterate projects
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateOrganizationProjects(
    organization: string,
    iteratee: ResourceIteratee<SonarCloudProject>,
  ): Promise<void> {
    await this.paginatedGetRequest<
      SonarCloudProjectsResponse,
      SonarCloudProject
    >(
      `/projects/search?organization=${organization}`,
      (res) => res.components,
      iteratee,
    );
  }

  /**
   * Iterates each issue resource belonging to provided organization.
   *
   * @param organization the organization from which to iterate issues
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateProjectIssues(
    project: string,
    iteratee: ResourceIteratee<SonarCloudIssue>,
  ): Promise<void> {
    await this.paginatedGetRequest<SonarCloudIssuesResponse, SonarCloudIssue>(
      `/issues/search?projects=${project}`,
      (res) => res.issues,
      iteratee,
    );
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
