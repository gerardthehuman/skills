import { Glob } from "bun";
import * as matter from "gray-matter-es";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import packageJson from "../package.json" with { type: "json" };

type Skill = {
  heading: string;
  description: string;
  path: string;
};

type Group = {
  heading: string;
  description: string;
  path: string;
  skills: Skill[];
};

const repository = packageJson.name.replace(/^@/, "");

export function parseMarkdown(source: string) {
  const { data, content } = matter.matter(source);

  const ast = fromMarkdown(content);
  const heading = ast.children.find((node) => node.type === "heading");
  const paragraph = ast.children.find((node) => node.type === "paragraph");

  return {
    frontmatter: data,
    heading: heading ? toString(heading) : undefined,
    paragraph: paragraph ? toString(paragraph) : undefined,
  };
}

const parseFile = async (path: string) => parseMarkdown(await Bun.file(path).text());

const groups = await (async () => {
  const groups: Group[] = [];

  for await (const source of new Glob("skills/*/README.md").scan(".")) {
    const dir = source.replace(/\/README\.md$/, "");
    const { heading, paragraph } = await parseFile(source);
    const skills: Skill[] = [];

    for await (const skillSource of new Glob(`${dir}/**/SKILL.md`).scan(".")) {
      const { frontmatter, heading: skillHeading } = await parseFile(skillSource);
      const description = frontmatter.description as string | undefined;
      const name = skillHeading ?? (frontmatter.name as string | undefined);

      if (!name || !description) {
        continue;
      }

      skills.push({ heading: name, description, path: skillSource });
    }

    groups.push({
      heading: heading ?? dir.split("/").pop()!,
      description: paragraph ?? "",
      path: source,
      skills: skills.sort((a, b) => a.heading.localeCompare(b.heading)),
    });
  }

  return groups.sort((a, b) => a.heading.localeCompare(b.heading));
})();

const renderSkill = (skill: Skill) =>
  `#### [${skill.heading}](${skill.path})\n\n${skill.description}`;
const renderGroup = (group: Group) =>
  [`### [${group.heading}](${group.path})`, group.description, ...group.skills.map(renderSkill)]
    .filter(Boolean)
    .join("\n\n");

const readme = async (path: string) => {
  const source = await Bun.file(path).text();

  return (sections: Record<string, string>) => {
    const content = Object.entries(sections).reduce((content, [section, value]) => {
      const start = `<!-- ${section}:START -->`;
      const end = `<!-- ${section}:END -->`;
      const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
      const replacement = `${start}\n${value}\n${end}`;

      if (pattern.test(content)) {
        return content.replace(pattern, () => replacement);
      }

      return `${content.trimEnd()}\n\n${replacement}\n`;
    }, source);

    return Bun.write(path, content);
  };
};

const skillCount = groups.reduce((count, group) => count + group.skills.length, 0);

await readme("README.md").then((write) => {
  const installer = (skill?: string) => {
    const cmd = ["npx", "pnpm dlx", "bun x"];
    const args = ["skills", "add", repository, skill ? `--skill ${skill}` : undefined]
      .filter(Boolean)
      .join(" ");

    return `\`\`\`bash\n${cmd.map((c) => `${c} ${args}`).join("\n")}\n\`\`\``;
  };

  return write({
    INSTALL: installer(),
    SKILLS:
      skillCount === 0
        ? "_No skills found. Add a skill to the `skills/` directory to get started._"
        : groups.map(renderGroup).join("\n\n"),
  });
});

console.log(`Updated README.md with ${skillCount} skill(s).`);
