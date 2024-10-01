import Head from "next/head";
import {useEffect} from "react";

const Login = (_props: any) => {
    useEffect(() => {
        window.location.href = "/api/login"
    });

    return <>
        <Head>
            <title>Logowanie | GRAJEK</title>
        </Head>
        <p>Przekierowanie do logowania...</p>
    </>
}


export default Login
