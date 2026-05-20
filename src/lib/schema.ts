import { z } from "zod";
import { ROLES } from "./registry";

const RoleEnum = z.enum(ROLES);
const Roles = z.array(RoleEnum).min(1).optional();

const ByRole = <T extends z.ZodTypeAny>(value: T) =>
  z
    .object({
      default: value,
      byRole: z.record(RoleEnum, value).optional(),
    })
    .strict();

export const ResumeSchema = z
  .object({
    meta: z
      .object({
        name: z.string().min(1),
        titles: ByRole(z.string().min(1)),
        contact: z
          .object({
            phone: z.string().min(1),
            email: z.string().email(),
            location: z.string().min(1),
            links: z
              .array(
                z
                  .object({ label: z.string().min(1), url: z.string().url() })
                  .strict(),
              )
              .default([]),
          })
          .strict(),
      })
      .strict(),

    overview: ByRole(z.string().min(1)),

    competencies: z
      .array(
        z
          .object({
            category: z.string().min(1),
            items: z.array(z.string().min(1)).min(1),
            roles: Roles,
          })
          .strict(),
      )
      .default([]),

    experience: z
      .array(
        z
          .object({
            company: z.string().min(1),
            location: z.string().optional(),
            role: z.string().min(1),
            period: z.string().min(1),
            summary: z.string().optional(),
            bullets: z
              .array(z.object({ text: z.string().min(1), roles: Roles }).strict())
              .default([]),
            techStack: z
              .array(
                z
                  .object({
                    items: z.array(z.string().min(1)).min(1),
                    roles: Roles,
                  })
                  .strict(),
              )
              .optional(),
          })
          .strict(),
      )
      .default([]),

    projects: z
      .array(
        z
          .object({
            name: z.string().min(1),
            description: z.string().min(1),
            url: z.string().url().optional(),
            roles: Roles,
          })
          .strict(),
      )
      .default([]),

    education: z
      .array(
        z
          .object({
            degree: z.string().min(1),
            institution: z.string().min(1),
            year: z.string().min(1),
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

export type Resume = z.infer<typeof ResumeSchema>;
