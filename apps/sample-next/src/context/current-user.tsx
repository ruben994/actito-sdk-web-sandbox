"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentDevice } from "actito-web/core";

const CurrentUserContext = createContext<CurrentUserState | undefined>(undefined);

export function CurrentUserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const device = getCurrentDevice();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser({ userId: device?.userId, userName: device?.userName });
  }, []);

  const state = useMemo<CurrentUserState>(
    () => ({
      user: user,
      setUser: setUser,
    }),
    [user, setUser],
  );

  return <CurrentUserContext.Provider value={state}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser(): CurrentUserState {
  const state = useContext(CurrentUserContext);

  if (!state) {
    throw new Error("Unable to find the CurrentUserProvider in the component tree.");
  }

  return state;
}

type CurrentUserState = {
  user?: User;
  setUser: (user?: User) => void;
};

type User = {
  userId?: string;
  userName?: string;
};
