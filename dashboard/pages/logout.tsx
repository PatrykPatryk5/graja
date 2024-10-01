import Head from "next/head";
import { useEffect } from "react";

export default function Logout(_props: any) {
    useEffect(() => {
        window.location.href = "/api/logout"
    }, []);

    return <>
        <Head>
            <title>Wylogowanie | GRAJEK</title>
        </Head>
        <p>Przekierowanie do wylogowania...</p>
    </>
}
