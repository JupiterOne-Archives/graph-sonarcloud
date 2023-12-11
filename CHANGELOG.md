# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 1.1.2 - 2023-12-11

### Added

- Added additional logs for debugging an issue when ingesting sonarcloud_issue
  entities.

## 1.1.1 - 2023-01-20

### Fixed

- Fixed `organization` property value for creating mapped relationships between
  projects and repos.

## 1.1.0 - 2023-01-05

### Added

The following mapped relationship is **now** created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` | Direction |
| --------------------- | --------------------- | --------------------- | --------- |
| `sonarcloud_project`  | **SCANS**             | `*CodeRepo*`          | FORWARD   |

## 1.0.0 - 2022-08-05

### Added

Initial SonarCloud integration.

- Ingest new entity `sonarcloud_user`
- Ingest new entity `sonarcloud_group`
- Ingest new entity `sonarcloud_project`
- Ingest new entity `sonarcloud_issue`

- Build new relationship `sonarcloud_organization_has_group`
- Build new relationship `sonarcloud_organization_has_project`
- Build new relationship `sonarcloud_group_has_user`
- Build new relationship `sonarcloud_project_has_issue`
