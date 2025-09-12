"use server";

import { cookies } from "next/headers";

export default async function setCookies(name, value) {
    try {
        const setCookies = await cookies();
        setCookies.set(name, value, {
            httpOnly: true,
            secure: process.env.MODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
            path: "/"
        });
    } catch (error) {
        console.log(error)
    }
}