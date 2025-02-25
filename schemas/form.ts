import { z } from "zod"

// Define your Zod schema for form fields
export const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().optional()
})

export type formSchemaType = z.infer<typeof formSchema>