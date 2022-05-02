# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

Initial SonarCloud integration.

- Ingest new entity `sonarcloud_account`
- Ingest new entity `sonarcloud_user`
- Ingest new entity `sonarcloud_group`
- Ingest new entity `sonarcloud_project`
- Ingest new entity `sonarcloud_issue`

- Build new relationship `sonarcloud_account_has_user`
- Build new relationship `sonarcloud_account_has_organization`
- Build new relationship `sonarcloud_organization_has_group`
- Build new relationship `sonarcloud_organization_has_project`
- Build new relationship `sonarcloud_group_has_user`
- Build new relationship `sonarcloud_project_has_issue`
