import Steps from 'components/howitworks/Steps';
import SideNav from 'components/layout/SideNav';
import Footer from 'components/unAuthed/Footer';
import CustomNavbar from 'components/unAuthed/Navbar';
import Head from 'next/head';
import React from 'react';

const Howitworks: React.FC = () => {
    return (
        <>
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
            <CustomNavbar />
            <div className="row flex pt-12">
                <div className="container flex">
                    <div className="col-md-2 mx-auto hidden md:flex flex-col">
                        <SideNav />
                    </div>
                    <div className="col-md-10 mx-auto h-full pl-5">
                        <h1 className="text-blue-800 text-xl ">How it works</h1>
                        <h2 className="text-orange-400 font-semibold">QualityUnitedWriters - How it works</h2>

                        <p className="pt-1 pb-2 text-lg">
                            Thousands of college students have used QualityUnitedwriters as their secret weapon to make their life easier.
                        </p>

                        <p className="pt-1 pb-2 text-lg">Now it is your turn.                        </p>

                        <h1 className="text-blue-800 text-xl">How to Get Started</h1>
                        <Steps />
                        <div className="pt-1 pb-2 text-lg">
                            Embarking on your academic journey with QualityUnitedWriters is a seamless process designed to empower students and make their educational endeavors more manageable. Joining the ranks of thousands of college students who have already discovered the benefits, our platform acts as your secret weapon for academic success. The process is simple yet effective – students connect with skilled writers who excel in their respective fields. Whether it is a challenging assignment, research paper, or any academic assignment, QualityUnitedWriters is your go-to destination. Step by step, you post your assignment, select the best-suited writer, and watch as your academic workload becomes more manageable. Experience the convenience and excellence that QualityUnitedWriters brings to your educational journey.
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Howitworks;