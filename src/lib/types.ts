export type { Resume } from "./schema";
export type { Role, Template } from "./registry";

import type { Resume } from "./schema";

export type Experience = Resume["experience"][number];
export type Competency = Resume["competencies"][number];
export type Project = Resume["projects"][number];
export type Education = Resume["education"][number];
export type Bullet = Experience["bullets"][number];
