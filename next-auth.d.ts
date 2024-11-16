import NextAuth from "next-auth";
import {BookItemITF} from "@/components/BookItem/BookItem";

declare module "next-auth" {
    // Extending the `User` type
    interface User {
        books: BookItemITF[];
        rememberMe: boolean;
    }

    // Extending the `Session` type
    interface Session {
        user: User; // This ensures your custom `User` type is used in the session
    }
}