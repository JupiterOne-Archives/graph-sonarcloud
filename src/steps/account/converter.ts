import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(email: string): Entity {
  const id = `sonarcloud_account:${email}`;

  return createIntegrationEntity({
    entityData: {
      source: {
        id,
        name: 'SonarCloud account',
      },
      assign: {
        _key: id,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        mfaEnabled: true,
      },
    },
  });
}
