import { createContext } from "react";
import { Machine } from "./machines";

export const MachinesContext = createContext([] as Machine[]);