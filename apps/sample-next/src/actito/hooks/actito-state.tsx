import { useActito } from "@/actito/actito-context";

export function useActitoState() {
  const { state } = useActito();
  return state;
}
