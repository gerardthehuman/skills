import { Glob } from "bun";
import * as matter from "gray-matter-es";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import { basename, dirname } from "node:path";

export type Skill = {
  name: string;
  heading: string;
  description: string;
  path: string;
};

export type SkillGroup = {
  heading: string;
  description: string;
  path: string;
  skills: Skill[];
};

const parseFile = async (path: string) => {
  const { data, content } = matter.matter(await Bun.file(path).text());
  const ast = fromMarkdown(content);
  const heading = ast.children.find((node) => node.type === "heading");
  const paragraph = ast.children.find((node) => node.type === "paragraph");

  return {
    frontmatter: data,
    heading: heading ? toString(heading) : undefined,
    paragraph: paragraph ? toString(paragraph) : undefined,
  };
};

const loadSkill = async (path: string): Promise<Skill | undefined> => {
  const { frontmatter, heading } = await parseFile(path);
  const name = frontmatter.name as string | undefined;
  const description = frontmatter.description as string | undefined;

  if (!name || !description) {
    return undefined;
  }

  return { name, heading: heading ?? name, description, path };
};

const loadGroup = async (readme: string): Promise<SkillGroup> => {
  const dir = dirname(readme);
  const { heading, paragraph } = await parseFile(readme);
  const skills: Skill[] = [];

  for await (const path of new Glob(`${dir}/**/SKILL.md`).scan(".")) {
    const skill = await loadSkill(path);
    if (skill) {
      skills.push(skill);
    }
  }

  return {
    heading: heading ?? basename(dir),
    description: paragraph ?? "",
    path: readme,
    skills: skills.sort((a, b) => a.heading.localeCompare(b.heading)),
  };
};

/**
 * Discovers skills under `skills/`.
 * - A directory with a `README.md` is a group; its nested `SKILL.md` files are its skills.
 * - A directory with a `SKILL.md` and no `README.md` is an ungrouped top-level skill.
 */
export async function skills(): Promise<Array<Skill | SkillGroup>> {
  const groupReadmes: string[] = [];
  for await (const path of new Glob("skills/*/README.md").scan(".")) {
    groupReadmes.push(path);
  }
  const groupDirs = new Set(groupReadmes.map(dirname));

  const items: Array<Skill | SkillGroup> = [];

  for (const readme of groupReadmes) {
    items.push(await loadGroup(readme));
  }

  for await (const path of new Glob("skills/*/SKILL.md").scan(".")) {
    if (groupDirs.has(dirname(path))) {
      continue;
    }
    const skill = await loadSkill(path);
    if (skill) {
      items.push(skill);
    }
  }

  return items.sort((a, b) => a.heading.localeCompare(b.heading));
}
