import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                password: { label: "Access Code", type: "password" },
            },
            authorize: async (credentials) => {
                // Simple access code check for "Restricted Access"
                // In a real app, check against DB or env var
                const accessCode = process.env.ACCESS_CODE || "museum2024";

                if (credentials.password === accessCode) {
                    // Return a mock user object
                    return {
                        id: "1",
                        name: "Student Curator",
                        email: "student@museum.edu",
                    };
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login
            return !!auth;
        },
    },
});
