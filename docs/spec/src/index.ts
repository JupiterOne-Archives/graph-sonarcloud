import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { organizationSpec } from './organizations';
import { groupSpec } from './groups';
import { userSpec } from './users';
import { projectSpec } from './projects';
import { issueSpec } from './issues';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...organizationSpec,
    ...groupSpec,
    ...userSpec,
    ...projectSpec,
    ...issueSpec,
  ],
};
