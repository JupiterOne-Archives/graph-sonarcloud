import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_CLIENT_ORGANIZATIONS = 'j1-test-organization';
const DEFAULT_CLIENT_SECRET = 'dummy-acme-client-secret';

export const integrationConfig: IntegrationConfig = {
  clientOrganizations:
    process.env.CLIENT_ORGANIZATIONS || DEFAULT_CLIENT_ORGANIZATIONS,
  clientSecret: process.env.CLIENT_SECRET || DEFAULT_CLIENT_SECRET,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
