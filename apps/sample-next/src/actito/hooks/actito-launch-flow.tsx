import { useActito } from "@/actito/actito-context";

export function useActitoLaunchFlow() {
  const { state, launch, unlaunch } = useActito();
  return { state, launch, unlaunch };
}
