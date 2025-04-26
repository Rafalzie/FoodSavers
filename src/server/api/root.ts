import { postRouter } from "@food-saviors/server/api/routers/post";
import {
  createCallerFactory,
  createTRPCRouter,
} from "@food-saviors/server/api/trpc";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";
import { businessRouter } from "./routers/business";
import { reviewRouter } from "./routers/review";
import { allergenRouter } from "./routers/allergen";
import { purchaseRouter } from "./routers/purchase";
import { productAllergenRouter } from "./routers/productAllergen";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  product: productRouter,
  user: userRouter,
  business: businessRouter,
  review: reviewRouter,
  allergen: allergenRouter,
  purchase: purchaseRouter,
  productAllergen: productAllergenRouter,
  auth: authRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
