import { env } from "@food-saviors/env";
import {
  createTRPCRouter,
  publicProcedure,
} from "@food-saviors/server/api/trpc";

import { UserSchema } from "@schemas/*";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const authRouter = createTRPCRouter({
  // REGISTER
  register: publicProcedure
    .input(UserSchema.omit({ id: true, dateOfBirth: true })) // 👈 no DOB
    .mutation(async ({ ctx, input }) => {
      const { email, password, name } = input;

      try {
        const existingUser = await ctx.db.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already in use",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await ctx.db.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
          },
        });

        const token = jwt.sign(newUser, env.JWT_SECRET, {
          expiresIn: "7d",
        });

        const { password: _password, ...userWithoutPassword } = newUser;

        return {
          status: "success",
          data: {
            user: userWithoutPassword,
            token,
          },
        };
      } catch (error: any) {
        // 🧠 Log real backend error
        console.error("Register error:", JSON.stringify(error, null, 2));

        // 🛑 Prisma unique constraint error (email already exists)
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already exists",
          });
        }

        // ❌ Unknown error fallback
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account",
        });
      }
    }),

  // LOGIN
  login: publicProcedure
    .input(UserSchema.pick({ email: true, password: true }))
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      try {
        const user = await ctx.db.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid credentials",
          });
        }

        const token = jwt.sign(user, env.JWT_SECRET, {
          expiresIn: "7d",
        });

        const { password: _password, ...userWithoutPassword } = user;

        return {
          status: "success",
          data: {
            user: userWithoutPassword,
            token,
          },
        };
      } catch (error) {
        console.error("Login error:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to login",
        });
      }
    }),
});
