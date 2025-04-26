import { z } from 'zod';

export const BusinessScalarFieldEnumSchema = z.enum(['id','name','location','category','ownerId']);

export default BusinessScalarFieldEnumSchema;
