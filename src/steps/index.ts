import { organizationSteps } from './organizations';
import { userSteps } from './users';
import { groupSteps } from './groups';
import { projectSteps } from './projects';
import { issuesSteps } from './issues';

const integrationSteps = [
  ...organizationSteps,
  ...userSteps,
  ...groupSteps,
  ...projectSteps,
  ...issuesSteps,
];

export { integrationSteps };
