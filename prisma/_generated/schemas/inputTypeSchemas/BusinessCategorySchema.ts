import { z } from 'zod';

export const BusinessCategorySchema = z.enum(['RESTAURANT','BAKERY','GROCERY']);

export type BusinessCategoryType = `${z.infer<typeof BusinessCategorySchema>}`

export default BusinessCategorySchema;
