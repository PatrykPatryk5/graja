import {AudiotrackRounded, SettingsRounded, YouTube} from '@mui/icons-material'
import {Button, Card, Container, Link, Text} from '@nextui-org/react'
import Head from 'next/head'
import {useEffect, useState} from 'react'
import {getData, IData} from '../utils/data'

const Home = (_props: any) => {
    const [data, setData] = useState<IData | null>(null)

    useEffect(() => {
	    getData().then(res => {
		    setData(res);
		    if (res.redirect?.length) window.location.href = res.redirect;
	    })
    }, [])

    return (
        <Container>
            <Head>
                <title>GRAJEK</title>
            </Head>
            <Container css={ {
                display: 'flex',
                alignItems: 'center',
                background: '$gray50',
                position: 'fixed',
                padding: '20px',
                minWidth: '100%',
                left: '0',
                top: '0',
                zIndex: '$5'
            } }>
                <Link css={ {fontSize: '$xl', fontWeight: '$semibold'} } href='/'>
                    { data ? data.name : "Discord Music Bot" }
                </Link>
                <Link color='text' css={ {fontSize: '$lg', fontWeight: '$medium', marginLeft: '20px'} } href='#'>
                    Dom
                </Link>
                <Link color='text' css={ {fontSize: '$lg', fontWeight: '$medium', marginLeft: '20px'} }
                      href='#features'>
                    Funkcje
                </Link>
                <Button onClick={ () => window.location.pathname = '/dashboard' } css={ {marginLeft: 'auto'} } auto shadow>
                    Panel Sterowania
                </Button>
            </Container>
            <Container style={ {
                textAlign: 'center',
                marginTop: '1rem',
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            } }>
                <Text h1 css={ {textGradient: "180deg, $blue600 -20%, $blue800 100%",} }>GRAJEK</Text>
                <Text h3 css={ {color: '$gray800'} }>Zaawansowany bot muzyczny Discord, obsługuje Spotify, SoundCloud,
                YouTube z tasowaniem, regulacją głośności i pulpitem nawigacyjnym!</Text>
                <Container css={ {display: 'flex', alignItems: 'center', justifyContent: 'center'} }>
                    <Button color="primary" onClick={ () => window.location.pathname = '/login' } shadow style={ {
                        marginTop: '1rem'
                    } }>Zaloguj się
                    </Button>
                    <Button color="primary" flat
                            onClick={ () => window.open('https://discord.gg/6uTDepsCCx') } style={ {
                        marginTop: '1rem',
                        marginLeft: '20px'
                    } }>Discord
                    </Button>
                </Container>
            </Container>
            <Container css={ {display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh'} }>
                <Text h2>Funkcje</Text>
                <Container css={ {display: 'flex', justifyContent: 'center', flexWrap: 'wrap'} }>
                    <Card isHoverable css={ {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '10px',
                        width: '300px',
                        padding: '20px',
                        textAlign: 'center'
                    } }>
                        <YouTube style={ {fontSize: '150px', color: '#3694FF'} }/>
                        <Text h3>Obsługa Spotify, Soundcloud i Youtube</Text>
                        <Text css={ {color: '$gray800'} }>
                        Korzystaj z list odtwarzania spotify, filmów z youtube, list odtwarzania youtube
                        i wiele więcej za pomocą tego bota
                        </Text>
                    </Card>
                    <Card isHoverable css={ {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '10px',
                        width: '300px',
                        padding: '20px',
                        textAlign: 'center'
                    } }>
                        <AudiotrackRounded style={ {fontSize: '150px', color: '#3694FF'} }/>
                        <Text h3>Muzyka bez opóźnień</Text>
                        <Text css={ {color: '$gray800'} }>
                        Ten bot nigdy się nie opóźni podczas odtwarzania dowolnego utworu na kanale głosowym.
                        </Text>
                    </Card>
                    <Card isHoverable css={ {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '10px',
                        width: '300px',
                        padding: '20px',
                        textAlign: 'center'
                    } }>
                        <SettingsRounded style={ {fontSize: '150px', color: '#3694FF'} }/>
                        <Text h3>Ustawienia serwera</Text>
                        <Text css={ {color: '$gray800'} }>
                        Steruj zapętlonym utworem lub kolejką, łatwo odtwarzaj lub wstrzymuj utwór, lub całkowicie zatrzymaj bota.
                        całkowicie.
                        </Text>
                    </Card>
                </Container>
            </Container>
            <Container css={ {
                marginTop: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '60vh'
            } }>
                <Text h2>Na co czekasz?</Text>
                <Button shadow size={ 'md' } css={ {marginTop: '5em'} }>Zacznij teraz</Button>
            </Container>
        </Container>
    )
}


export default Home 
