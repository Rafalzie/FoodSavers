import { z, ZodSchema } from "zod";

type PKey = number;
export type Id = { id: PKey };

/**
 * Schema for Id validation
 */
export const IdSchema = z.object({
  id: z.number().int()
});


// TODO: Look for a way to better implement something like this
/**
 * @template T
 * @param schema to remove `id` property from
 * @returns schema without `id`
 */
export const NoId = <T extends z.AnyZodObject>(schema: T) => (schema.omit({ id: true }))
