// ? Importing handlers from the auth module
//* Referring to the auth.ts we just created
import { handlers } from "@/auth";

//* Exporting GET and POST handlers from imported handlers object
export const { GET, POST } = handlers;
