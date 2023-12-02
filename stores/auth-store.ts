"use client";
import { create } from "zustand";

export interface Session {
  accessToken: string;
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

type State = {
  session?: undefined | null | Session;
  // status: "authenticated" | "unauthenticated" | "loading";
};

type Action = {
  setSession: (session: State["session"]) => void;
  // setStatus: (status: State["status"]) => void;
};

const useAuthStore = create<State & Action>((set) => ({
  // status: "unauthenticated",
  session: undefined,
  setSession: (session) => set((state) => ({ ...state, session })),
  // setStatus: (status) => set((state) => ({ ...state, status })),
}));

export const useSession = () => {
  const { session } = useAuthStore();

  return session;
};

export const useSetSession = () => useAuthStore((state) => state.setSession);
