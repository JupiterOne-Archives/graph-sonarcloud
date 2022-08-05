import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getOrganizationKey(name: string): string {
  return `sonarcloud_organization:${name}`;
}

export function createOrganizationEntity(name: string): Entity {
  const id = getOrganizationKey(name);

  return createIntegrationEntity({
    entityData: {
      source: {
        id,
      },
      assign: {
        _type: Entities.ORGANIZATION._type,
        _class: Entities.ORGANIZATION._class,
        _key: id,
        name,
      },
    },
  });
}
