import { skills, type SkillGroup } from "./skills.ts";

const groupings = (await skills())
  .filter((item): item is SkillGroup => "skills" in item && item.skills.length > 0)
  .map((group) => ({
    title: group.heading,
    ...(group.description ? { description: group.description } : {}),
    skills: group.skills.map((skill) => skill.name),
  }));

const manifest = {
  $schema: "https://skills.sh/schemas/skills.sh.schema.json",
  notGrouped: "bottom",
  groupings,
};

await Bun.write("skills.sh.json", `${JSON.stringify(manifest, null, 2)}\n`);

const skillCount = groupings.reduce((count, group) => count + group.skills.length, 0);
console.log(`Updated skills.sh.json with ${skillCount} skill(s) in ${groupings.length} group(s).`);
