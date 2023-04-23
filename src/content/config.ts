import { z, defineCollection } from "astro:content";

const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    badge: z.string().optional(),
    tags: z.array(z.string()).optional()
});

const projetsSchema = z.object({
    title: z.string(),
    description: z.string(),
    link: z.string(),
    icon: z.string().optional(),
    badge: z.string().optional(),
    tags: z.array(z.string()).optional(),
    installs: z.number().positive().optional(),
    pos: z.number()
})


export type BlogSchema = z.infer<typeof blogSchema>;
export type ProjetsSchema = z.infer<typeof projetsSchema>;

const blogCollection = defineCollection({ schema: blogSchema });
const projetsCollection = defineCollection({ schema: projetsSchema });

export const collections = {
    'blog': blogCollection,
    'projets': projetsCollection,
}
