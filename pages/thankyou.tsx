import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ThankYouPage = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);
    // Retrieve the previous page URL from the cookie
    const previousPageURL = Cookies.get('previousPageURL');

    const decrementCountdown = () => {
        if (countdown > 0) {
            setCountdown(countdown - 1);
        } else {
            router.back();
            router.back(); // Go back two pages
        }
    };

    useEffect(() => {
        const countdownTimer = setInterval(decrementCountdown, 1000);
        return () => {
            clearInterval(countdownTimer);
            if (countdown === 0) {
                router.back();
                router.back(); // Go back two pages
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown, router]);

    return (
        <div className="container mx-auto text-center w-5/6 p-4 m-4 bg-gray-100">
            <Head>
                <title>
                    QualityUnitedWriters - Your Academic Research and Project Partner
                </title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta
                    name="description"
                    content="Discover a dedicated platform for students and tutors offering expert assistance in a wide range of academic research and projects. Quality Unitted Writers connects you with quality solutions for your educational needs. Whether you're seeking help with essays, theses, or any academic work, our talented team is here to assist you."
                />
                <meta name="keywords" content="Academic writing services, Expert academic writers, Professional research assistance, High-quality research papers, Academic project support, Thesis and dissertation help, Essay writing service, Top-rated tutors, Academic success tips, Homework assistance, Online tutoring, Quality writing solutions, Best essay writers, Custom research papers, Academic support platform, Tutoring for students, Research paper editing, Writing and editing services, Academic guidance, Homework help for students" />
                <meta name="author" content="QualityUnitedWriters" />
                <meta name="robots" content="index, follow" />
                <meta name="og:title" property="og:title" content="QualityUnitedWriters - Your Academic Research and Project Partner" />
                <meta
                    name="og:description"
                    property="og:description"
                    content="Discover a dedicated platform for students and tutors offering expert assistance in a wide range of academic research and projects. Quality Unitted Writers connects you with quality solutions for your educational needs. Whether you're seeking help with essays, theses, or any academic work, our talented team is here to assist you."
                />
                <meta name="og:image" property="og:image" content="public/sync-my-socials-logo.png" />

                <meta name="og:url" property="og:url" content="https://www.qualityunitedswriters.com" />
            </Head>
            <div className="p-4 rounded ">
                <h1 className="text-5xl text-center text-blue-900 font-bold border-1mt-8">Thank you!</h1>
                <p className="mt-4 text-3xl">Thank you for reaching out to us! Your message has been sent successfully.
                    We appreciate your communication and value your feedback. We look forward to assisting you further and continuing our interaction.

                </p>
            </div>
            <p className="mt-4 mb-4 text-3xl">
                Redirecting to the previous page in <span className="bg-red-800 px-3 rounded text-white">{countdown}</span> seconds.
            </p>
            <div className="w-full flex justify-center align-center space-x-5">
                <div className="mt-4 bg-blue-800 text-white rounded p-3">
                    <Link href="/">Go back to home</Link>
                </div>
                <div className="mt-4 bg-blue-800 text-white rounded p-3">
                    <Link href="/contact">Send another message</Link>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;
