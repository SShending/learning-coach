import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

export interface GitHubClientFactory {
  forInstallation(installationId: number): Octokit;
}

export class GitHubAppClientFactory implements GitHubClientFactory {
  constructor(
    private readonly options: {
      appId: number;
      privateKey: string;
    },
  ) {}

  forInstallation(installationId: number): Octokit {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: this.options.appId,
        privateKey: this.options.privateKey,
        installationId,
      },
    });
  }
}
