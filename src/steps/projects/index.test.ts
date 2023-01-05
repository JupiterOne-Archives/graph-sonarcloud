import { createStepCollectionTest } from '../../../test/recording';
import { MappedRelationships, Steps } from '../constants';

test(
  'fetch-projects',
  createStepCollectionTest({
    directoryName: __dirname,
    recordingName: 'fetch-projects',
    stepId: Steps.PROJECTS,
    async afterExecute({ stepResult }) {
      // NOTE: This is temporary. Once `toMatchStepMetadata` supports mapped
      // relationships, then this can be removed.
      const collectedMappedRelationships =
        stepResult.collectedRelationships.filter((r) => {
          return (
            r._type === MappedRelationships.PROJECT_SCANS_CODEREPO._type &&
            r._class === MappedRelationships.PROJECT_SCANS_CODEREPO._class
          );
        });

      expect(collectedMappedRelationships.length).toBeGreaterThan(0);
      return Promise.resolve();
    },
  }),
);
