export interface Pageable {
  paging: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
}

export interface PageableV2 {
  p: number;
  ps: number;
  total: number;
}

// https://sonarcloud.io/api/authentication/validate
export interface SonarCloudAuthResponse {
  valid: boolean;
}

export interface SonarCloudProject {
  organization: string;
  key: string;
  name: string;
  qualifier: string;
  visibility: 'public' | 'private';
}

// https://sonarcloud.io/api/projects/search?organization=<name>
export interface SonarCloudProjectsResponse extends Pageable {
  components: SonarCloudProject[];
}

export interface SonarCloudUser {
  login: string;
  name: string;
  avatar: string;
  groupCount: number;
  isOrgAdmin: boolean;
}

// https://sonarcloud.io/api/organizations/search_members?organization=<name>
export interface SonarCloudUsersResponse extends Pageable {
  users: SonarCloudUser[];
}

export interface SonarCloudUserGroup {
  id: number;
  name: string;
  description: string;
  membersCount: number;
  default: boolean;
}

// https://sonarcloud.io/api/user_groups/search?organization=<name>
export interface SonarCloudUserGroupsResponse extends Pageable {
  groups: SonarCloudUserGroup[];
}

// https://sonarcloud.io/api/user_groups/?id=<id>
export interface SonarCloudGroupUsersResponse extends PageableV2 {
  users: SonarCloudUser[];
}

export interface SonarCloudIssue {
  key: string;
  component: string;
  project: string;
  status: string;
  severity: string;
  creationDate: string;
  updateDate: string;
}

export interface SonarCloudIssuesResponse extends Pageable {
  issues: SonarCloudIssue[];
}
