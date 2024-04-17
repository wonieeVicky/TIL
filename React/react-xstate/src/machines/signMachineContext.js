import { createActorContext } from "@xstate/react";
import { signMachine } from "./signMachine";

export const signMachineContext = createActorContext(signMachine);
