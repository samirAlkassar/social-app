"use server";

import { cookies } from "next/headers";

const deleteCookies = async (key) => {
    try {
        const deleteCookies = await cookies();
        deleteCookies.delete(key)
    } catch (error) {
        console.log(error)
    }
}

export default deleteCookies;