import { InvalidTokenError } from "@modelcontextprotocol/sdk/server/auth/errors.js";
import type { OAuthTokenVerifier } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTVerifyGetKey,
} from "jose";

export type JwtAccessTokenVerifierOptions = {
  issuer: string;
  audience: string;
  jwksUri?: URL;
  keySet?: JWTVerifyGetKey;
  algorithms?: string[];
};

export class JwtAccessTokenVerifier implements OAuthTokenVerifier {
  readonly #keySet: JWTVerifyGetKey;
  readonly #algorithms: string[];

  constructor(private readonly options: JwtAccessTokenVerifierOptions) {
    if (options.keySet === undefined && options.jwksUri === undefined) {
      throw new Error("JwtAccessTokenVerifier requires a JWKS URI or injected key set.");
    }
    this.#keySet = options.keySet ?? createRemoteJWKSet(options.jwksUri as URL);
    this.#algorithms = options.algorithms ?? ["RS256", "ES256"];
  }

  async verifyAccessToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.#keySet, {
        issuer: this.options.issuer,
        audience: this.options.audience,
        algorithms: this.#algorithms,
      });
      if (typeof payload.sub !== "string" || payload.sub.length === 0) {
        throw new Error("missing subject");
      }
      if (typeof payload.exp !== "number") {
        throw new Error("missing expiration");
      }
      const clientId = this.stringClaim(payload.client_id) ?? this.stringClaim(payload.azp);
      if (clientId === undefined) {
        throw new Error("missing client ID");
      }

      return {
        token,
        clientId,
        scopes: this.readScopes(payload.scope, payload.scp),
        expiresAt: payload.exp,
        resource: new URL(this.options.audience),
        extra: { learnerId: payload.sub },
      };
    } catch {
      throw new InvalidTokenError("The access token is invalid or expired.");
    }
  }

  private readScopes(scope: unknown, scp: unknown): string[] {
    const values = new Set<string>();
    if (typeof scope === "string") {
      for (const item of scope.split(/\s+/)) {
        if (item.length > 0) values.add(item);
      }
    }
    if (Array.isArray(scp)) {
      for (const item of scp) {
        if (typeof item === "string" && item.length > 0) values.add(item);
      }
    }
    return [...values];
  }

  private stringClaim(value: unknown): string | undefined {
    return typeof value === "string" && value.length > 0 ? value : undefined;
  }
}
