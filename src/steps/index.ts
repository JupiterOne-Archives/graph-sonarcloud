import { accountSteps } from './account';
import { accessSteps } from './access';
import { projectSteps } from './projects';
import { issuesSteps } from './issues';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...projectSteps,
  ...issuesSteps,
];

export { integrationSteps };
