import { dirname, relative } from "node:path";
import packageJson from "../package.json" with { type: "json" };
import { skills, type SkillGroup } from "./skills.ts";
import { format } from "oxfmt";

const repository = packageJson.name.replace(/^@/, "");

const updateSections = async (path: string, sections: Record<string, string>) => {
  let content = await Bun.file(path).text();

  for (const [section, value] of Object.entries(sections)) {
    const start = `<!-- ${section}:START -->`;
    const end = `<!-- ${section}:END -->`;
    const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
    const replacement = `${start}\n${value}\n${end}`;

    content = pattern.test(content)
      ? content.replace(pattern, () => replacement)
      : `${content.trimEnd()}\n\n${replacement}\n`;
  }

  await Bun.write(path, (await format(path, content)).code);
};

const items = await skills();
const groups = items.filter((item): item is SkillGroup => "skills" in item);
const skillCount = items.reduce(
  (count, item) => count + ("skills" in item ? item.skills.length : 1),
  0,
);

const installer = (skill?: string) => {
  const cmd = ["npx", "pnpm dlx", "bun x"];
  const args = ["skills", "add", repository, skill ? `--skill ${skill}` : undefined]
    .filter(Boolean)
    .join(" ");

  return `\`\`\`bash\n${cmd.map((c) => `${c} ${args}`).join("\n")}\n\`\`\``;
};

await updateSections("README.md", {
  INSTALL: installer(),
  SKILLS:
    skillCount === 0
      ? "_No skills found. Add a skill to the `skills/` directory to get started._"
      : items
          .map((item) => {
            if (!("skills" in item)) {
              return `### [${item.heading}](${item.path})\n\n${item.description}`;
            }
            const skillLines = item.skills.map(
              (skill) => `#### [${skill.heading}](${skill.path})\n\n${skill.description}`,
            );
            return [`### [${item.heading}](${item.path})`, item.description, ...skillLines]
              .filter(Boolean)
              .join("\n\n");
          })
          .join("\n\n"),
});

for (const group of groups) {
  const base = dirname(group.path);
  const skillList =
    group.skills.length === 0
      ? "_No skills in this group yet._"
      : group.skills
          .map((skill) => {
            const path = relative(base, skill.path);
            return `## [${skill.heading}](${path})\n\n${skill.description}`;
          })
          .join("\n\n");

  await updateSections(group.path, { SKILLS: skillList });
}

console.log(`Updated README.md and ${groups.length} group README(s) with ${skillCount} skill(s).`);
