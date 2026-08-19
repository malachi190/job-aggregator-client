import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"

export const checkClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await auth()
  return { isAuthenticated: !!userId, userId }
})