import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { SonarCloudUser } from '../../types';
import { Entities } from '../constants';

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
        organizationAdmin: user.isOrgAdmin,
      },
    },
  });
}
