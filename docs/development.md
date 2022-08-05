# Development

Add details here to give a brief overview of how to work with the provider APIs.
Please reference any SDKs or API docs used to help build the integration here.

## Prerequisites

Supply details about software or tooling (like maybe Docker or Terraform) that
is needed for development here.

Please supply references to documentation that details how to install those
dependencies here.

Tools like Node.js and NPM are already covered in the [README](../README.md) so
don't bother documenting that here.

## Provider account setup

1. Generate Token -
   [Generate an API token](https://sonarcloud.io/account/security)
2. Supply generated token as `CLIENT_SECRET` env field
3. Enter the organization name(s) (comma separated if plural) as
   `CLIENT_ORGANIZATIONS` env field that you wish to be ingested

## Authentication

Copy the .env.example to .env file and fill in the variables using the user
information and API token information generated from instructions above. The
mapping is as follows:

CLIENT_SECRET= ${API token} CLIENT_ORGANIZATIONS= ${organization(s) that you
wish to be ingested/iterated}
