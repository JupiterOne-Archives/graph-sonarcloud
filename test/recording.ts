import {
  IntegrationInvocationConfig,
  IntegrationInstanceConfig,
  Entity,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
  StepTestConfig,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from './config';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: mutations.unzipGzippedRecordingEntry,
    /*mutateEntry: (entry) => {
      redact(entry);
    },*/
  });
}

// a more sophisticated redaction example below:

/*
function getRedactedOAuthResponse() {
  return {
    access_token: '[REDACTED]',
    expires_in: 9999,
    token_type: 'Bearer',
  };
}

function redact(entry): void {
  if (entry.request.postData) {
    entry.request.postData.text = '[REDACTED]';
  }

  if (!entry.response.content.text) {
    return;
  }

  //let's unzip the entry so we can modify it
  mutations.unzipGzippedRecordingEntry(entry);

  //we can just get rid of all response content if this was the token call
  const requestUrl = entry.request.url;
  if (requestUrl.match(/oauth\/token/)) {
    entry.response.content.text = JSON.stringify(getRedactedOAuthResponse());
    return;
  }

  //if it wasn't a token call, parse the response text, removing any carriage returns or newlines
  const responseText = entry.response.content.text;
  const parsedResponseText = JSON.parse(responseText.replace(/\r?\n|\r/g, ''));

  //now we can modify the returned object as desired
  //in this example, if the return text is an array of objects that have the 'tenant' property...
  if (parsedResponseText[0]?.tenant) {
    for (let i = 0; i < parsedResponseText.length; i++) {
      parsedResponseText[i].client_secret = '[REDACTED]';
      parsedResponseText[i].jwt_configuration = '[REDACTED]';
      parsedResponseText[i].signing_keys = '[REDACTED]';
      parsedResponseText[i].encryption_key = '[REDACTED]';
      parsedResponseText[i].addons = '[REDACTED]';
      parsedResponseText[i].client_metadata = '[REDACTED]';
      parsedResponseText[i].mobile = '[REDACTED]';
      parsedResponseText[i].native_social_login = '[REDACTED]';
    }
  }

  entry.response.content.text = JSON.stringify(parsedResponseText);
} */

type WithRecordingParams = {
  recordingName: string;
  directoryName: string;
  recordingSetupOptions?: SetupRecordingInput['options'];
};

type AfterStepCollectionExecutionParams = {
  stepConfig: StepTestConfig<
    IntegrationInvocationConfig<IntegrationInstanceConfig>,
    IntegrationInstanceConfig
  >;
  stepResult: {
    collectedEntities: Entity[];
    collectedRelationships: Relationship[];
    collectedData: {
      [key: string]: any;
    };
    encounteredTypes: string[];
  };
};

type CreateStepCollectionTestParams = WithRecordingParams & {
  stepId: string;
  afterExecute?: (params: AfterStepCollectionExecutionParams) => Promise<void>;
};

async function withRecording(
  { recordingName, directoryName, recordingSetupOptions }: WithRecordingParams,
  cb: () => Promise<void>,
) {
  const recording = setupRecording({
    directory: directoryName,
    name: recordingName,
    options: {
      ...(recordingSetupOptions || {}),
    },
  });

  try {
    await cb();
  } finally {
    await recording.stop();
  }
}

function isMappedRelationship(r: Relationship): boolean {
  return !!r._mapping;
}

function filterDirectRelationships(
  relationships: Relationship[],
): Relationship[] {
  return relationships.filter((r) => !isMappedRelationship(r));
}

export function createStepCollectionTest({
  recordingName,
  directoryName,
  recordingSetupOptions,
  stepId,
  afterExecute,
}: CreateStepCollectionTestParams) {
  return async () => {
    await withRecording(
      {
        directoryName,
        recordingName,
        recordingSetupOptions,
      },
      async () => {
        const stepConfig = buildStepTestConfigForStep(stepId);
        const stepResult = await executeStepWithDependencies(stepConfig);

        expect({
          ...stepResult,
          // HACK (copied from `graph-snyk`): `@jupiterone/integration-sdk-testing`
          // does not currently support `toMatchStepMetadata` with mapped
          // relationships, which is causing tests to fail. We will add
          // support soon and remove this hack.
          collectedRelationships: filterDirectRelationships(
            stepResult.collectedRelationships,
          ),
        }).toMatchStepMetadata({
          ...stepConfig,
          invocationConfig: {
            ...stepConfig.invocationConfig,
            integrationSteps: stepConfig.invocationConfig.integrationSteps.map(
              (s) => {
                return {
                  ...s,
                  mappedRelationships: [],
                };
              },
            ),
          },
        });

        if (afterExecute) await afterExecute({ stepResult, stepConfig });
      },
    );
  };
}
