import type { Access, FieldAccess } from "payload"

type Role = "admin" | "editor"
type WithRole = { role?: Role | null } | null | undefined

export const anyone: Access = () => true
export const loggedIn: Access = ({ req }) => Boolean(req.user)
export const admins: Access = ({ req }) => (req.user as WithRole)?.role === "admin"
export const adminsField: FieldAccess = ({ req }) => (req.user as WithRole)?.role === "admin"
/** Public visitors see only published content; signed-in editors also see drafts. */
export const publishedOrLoggedIn: Access = ({ req }) => (req.user ? true : { _status: { equals: "published" } })
