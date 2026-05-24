import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";

async function fetchPrimaryEmail(accessToken) {
  const { data } = await axios.get("https://api.github.com/user/emails", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const primaryEmail = data.find((email) => email.primary)?.email;
  return primaryEmail || data[0]?.email || null;
}

export async function fetchGitHubProfileFromCode(code) {
  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: env.githubClientId,
        client_secret: env.githubClientSecret,
        code,
        redirect_uri: `${env.clientUrl}/auth/github/callback`,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!tokenResponse.data?.access_token) {
      throw new AppError("GitHub OAuth exchange failed", 401);
    }

    const accessToken = tokenResponse.data.access_token;

    const { data: profile } = await axios.get("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const email = profile.email || (await fetchPrimaryEmail(accessToken));

    return {
      githubId: String(profile.id),
      username: profile.login,
      email,
      avatar: profile.avatar_url || "",
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Unable to authenticate with GitHub", 401);
  }
}
