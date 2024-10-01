import Head from "next/head";
import {AudiotrackRounded, DnsRounded, PersonRounded, RocketLaunchRounded} from "@mui/icons-material"
import Content from "../components/content";
import StatCard from "../components/StatCard";
import {useEffect, useState} from "react";
import {getDashboard, IDashboard} from "../utils/dashboard";

const Dashboard = (_props: any) => {
    const [data, setData] = useState<IDashboard | null>(null)

    useEffect(() => {
        getDashboard().then(setData);
    }, []);

    return (<Content>
        <Head>
            <title>Pulpit nawigacyjny | GRAJEK</title>
        </Head>

        <h1>Dashboard</h1>
        <div style={ {
            display: 'flex',
        } }>
            <StatCard title='Commands Ran' amount={ data ? data.commandsRan : "Ładowanie" } icon={
                <RocketLaunchRounded fontSize="large"/> }
            />
            <StatCard title='Users' amount={ data ? data.users : "Ładowanie" } icon={
                <PersonRounded fontSize="large"/> }
            />
            <StatCard title='Servers' amount={ data ? data.servers : "Ładowanie" } icon={
                <DnsRounded fontSize="large"/> }
            />

            <StatCard title='Songs Played' amount={ data ? data.songsPlayed : "Ładowanie" } icon={
                <AudiotrackRounded fontSize="large"/> }
            />
        </div>
    </Content>)
}

export default Dashboard
