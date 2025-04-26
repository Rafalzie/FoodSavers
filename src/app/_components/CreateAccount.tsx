"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@food-saviors/trpc/react";

const CreateAccount: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const register = api.auth.register.useMutation({
    onSuccess: () => {
      setError(null);
      router.push("/login");
    },
    onError: (err) => {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create account");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    register.mutate({
      name,
      email,
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-xs">
        <button
          onClick={() => router.back()}
          className="mb-6 transition hover:opacity-70"
        >
          <img src="/arrowback.svg" alt="Back" className="h-5 w-5" />
        </button>

        <h1 className="mb-8 text-center text-2xl font-bold text-[#004D47]">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-[#009688] px-3 py-2 outline-none focus:ring-2 focus:ring-[#009688]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#009688] px-3 py-2 outline-none focus:ring-2 focus:ring-[#009688]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[#009688] px-3 py-2 outline-none focus:ring-2 focus:ring-[#009688]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-[#009688] px-3 py-2 outline-none focus:ring-2 focus:ring-[#009688]"
              required
            />
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={register.isLoading}
            className="w-full rounded-md bg-[#009688] py-2 font-semibold text-white transition hover:bg-[#00796B] disabled:opacity-50"
          >
            {register.isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
