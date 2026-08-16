import { z } from "zod";

const coreEnvironmentSchema = z.object({
  LEARNING_VAULT_STORE_PATH: z.string().min(1),
  LEARNING_VAULT_STORE_KEY: z.string().min(1),
  LEARNING_VAULT_GITHUB_APP_ID: z.coerce.number().int().positive(),
  LEARNING_VAULT_GITHUB_PRIVATE_KEY: z.string().min(1),
});

const httpEnvironmentSchema = coreEnvironmentSchema.extend({
  LEARNING_VAULT_HOST: z.string().min(1).default("0.0.0.0"),
  LEARNING_VAULT_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LEARNING_VAULT_PUBLIC_URL: z.string().url(),
  LEARNING_VAULT_OAUTH_ISSUER: z.string().url(),
  LEARNING_VAULT_OAUTH_AUDIENCE: z.string().url(),
  LEARNING_VAULT_OAUTH_JWKS_URI: z.string().url(),
  LEARNING_VAULT_OAUTH_AUTHORIZATION_ENDPOINT: z.string().url(),
  LEARNING_VAULT_OAUTH_TOKEN_ENDPOINT: z.string().url(),
  LEARNING_VAULT_OAUTH_REGISTRATION_ENDPOINT: z.string().url().optional(),
});

const stdioEnvironmentSchema = coreEnvironmentSchema.extend({
  LEARNING_VAULT_STDIO_LEARNER_ID: z.string().min(1),
});

export type CoreRuntimeConfig = ReturnType<typeof readCoreConfig>;

export function readCoreConfig(environment: NodeJS.ProcessEnv) {
  const parsed = coreEnvironmentSchema.parse(environment);
  return coreConfigFromParsed(parsed);
}

function coreConfigFromParsed(parsed: z.infer<typeof coreEnvironmentSchema>) {
  const storeKey = Buffer.from(parsed.LEARNING_VAULT_STORE_KEY, "base64");
  if (storeKey.byteLength !== 32) {
    throw new Error("LEARNING_VAULT_STORE_KEY must decode to exactly 32 bytes.");
  }
  return {
    storePath: parsed.LEARNING_VAULT_STORE_PATH,
    storeKey,
    githubAppId: parsed.LEARNING_VAULT_GITHUB_APP_ID,
    githubPrivateKey: parsed.LEARNING_VAULT_GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}

export function readHttpConfig(environment: NodeJS.ProcessEnv) {
  const parsed = httpEnvironmentSchema.parse(environment);
  const core = coreConfigFromParsed(parsed);
  const baseUrl = new URL(parsed.LEARNING_VAULT_PUBLIC_URL);
  const publicMcpUrl = new URL("/mcp", baseUrl);
  const oauthAudience = new URL(parsed.LEARNING_VAULT_OAUTH_AUDIENCE).href;
  if (oauthAudience !== publicMcpUrl.href) {
    throw new Error("LEARNING_VAULT_OAUTH_AUDIENCE must equal the public MCP URL.");
  }
  return {
    ...core,
    host: parsed.LEARNING_VAULT_HOST,
    port: parsed.LEARNING_VAULT_PORT,
    publicMcpUrl,
    oauthIssuer: parsed.LEARNING_VAULT_OAUTH_ISSUER,
    oauthAudience,
    oauthJwksUri: new URL(parsed.LEARNING_VAULT_OAUTH_JWKS_URI),
    oauthAuthorizationEndpoint: parsed.LEARNING_VAULT_OAUTH_AUTHORIZATION_ENDPOINT,
    oauthTokenEndpoint: parsed.LEARNING_VAULT_OAUTH_TOKEN_ENDPOINT,
    ...(parsed.LEARNING_VAULT_OAUTH_REGISTRATION_ENDPOINT === undefined
      ? {}
      : { oauthRegistrationEndpoint: parsed.LEARNING_VAULT_OAUTH_REGISTRATION_ENDPOINT }),
  };
}

export function readStdioConfig(environment: NodeJS.ProcessEnv) {
  const parsed = stdioEnvironmentSchema.parse(environment);
  return {
    ...coreConfigFromParsed(parsed),
    learnerId: parsed.LEARNING_VAULT_STDIO_LEARNER_ID,
  };
}
