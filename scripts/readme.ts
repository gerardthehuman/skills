import { Glob } from "bun";
import matter from "gray-matter";
import packageJson from "../package.json" with { type: "json" };

type Skill = {
  name: string;
  description: string;
  path: string;
};

const repository = packageJson.name.replace(/^@/, "");
const skills = await (async () => {
  const skills: Skill[] = [];

  for await (const source of new Glob("skills/*/SKILL.md").scan(".")) {
    const content = await Bun.file(source).text();
    const { name, description } = matter(content).data;
    const [, path] = source.split("/");

    if (!name || !description || !path) {
      continue;
    }

    skills.push({ name, description, path });
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
})();

const readme = async (path: string) => {
  const source = await Bun.file(path).text();

  return (sections: Record<string, string>) => {
    const content = Object.entries(sections).reduce(
      (content, [section, value]) => {
        const start = `<!-- ${section}:START -->`;
        const end = `<!-- ${section}:END -->`;
        const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
        const replacement = `${start}\n${value}\n${end}`;

        if (pattern.test(content)) {
          return content.replace(pattern, replacement);
        }

        return `${content.trimEnd()}\n\n${replacement}\n`;
      },
      source
    );

    return Bun.write(path, content);
  };
};

await readme("README.md").then((write) => {
  const installer = (skill?: string) => {
    const cmd = ['npx', 'pnpm dlx', 'bun x'];
    const args = `skills add ${repository} ${skill ? `--skill ${skill}` : ''}`;

    return `\`\`\`bash\n${cmd.map((c) => `${c} ${args}`).join('\n')}\n\`\`\``;
  }

  return write({
    INSTALL: installer(),
    SKILLS:
      skills.length === 0
        ? "_No skills found. Add a skill to the `skills/` directory to get started._"
        : skills
            .map((s) => `### [${s.name}](skills/${s.path}/SKILL.md)\n\n${s.description}`)
            .join("\n\n"),
  });
});

console.log(
  `Updated README.md with ${skills.length} skill(s).`
);
