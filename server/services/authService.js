import { User } from "../models/User.js";

export async function findOrCreateGitHubUser(profile) {
  const existingUser = await User.findOne({ githubId: profile.githubId });

  if (existingUser) {
    existingUser.username = profile.username;
    existingUser.email = profile.email;
    existingUser.avatar = profile.avatar;
    await existingUser.save();
    return existingUser;
  }

  return User.create(profile);
}

