"use server";

import { cookies } from "next/headers";

const getCookies = async (key) => {
    try {
        const getCookies = await cookies();
        return getCookies.get(key);
    } catch (error) {
        console.log(error)
    }
}

export default getCookies;