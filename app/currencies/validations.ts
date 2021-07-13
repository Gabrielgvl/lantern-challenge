import { z } from "zod";

export const Currency = z.object({ id: z.string(), symbol: z.string(), description: z.string() });
