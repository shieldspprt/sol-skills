export const repoUrl =
  process.env.NEXT_PUBLIC_GITHUB_REPO ??
  "https://github.com/Hubra-labs/sol-skills";

export const skillsDirectory = "skills";

export function buildNewSkillUrl(filename: string): string {
  return `${repoUrl}/new/main/${skillsDirectory}?filename=${encodeURIComponent(
    filename,
  )}`;
}
