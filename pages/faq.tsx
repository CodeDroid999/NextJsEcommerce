import Layout from "components/layout/Layout";
import Accordion from "components/support/FAQAccordion";
import Head from "next/head";

const FAQ = () => {
    return (
        <Layout>
            <Head>
                <title>
                    QualityunitedWriters | Get More Done | Post any assignment. Pick the best person. Get it done. | Post your assignment for free Earn money as a tutor
                </title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta
                    name="description"
                    content="QualityunitedWriters is your one-stop destination for finding the right assignments and talented taskers. Post any assignment, pick the best person, and get it done. Join now to earn money as a tutor or post your assignments for free."
                />
                <meta name="keywords" content="QualityunitedWriters, assignments, tutor, earn money, post assignment" />
                <meta name="author" content="QualityunitedWriters" />
                <meta name="robots" content="index, follow" />
                <meta name="og:title" property="og:title" content="QualityunitedWriters | Get More Done" />
                <meta
                    name="og:description"
                    property="og:description"
                    content="QualityunitedWriters is your one-stop destination for finding the right assignments and talented taskers. Post any assignment, pick the best person, and get it done. Join now to earn money as a tutor or post your assignments for free."
                />
                <meta name="og:image" property="og:image" content="public/sync-my-socials-logo.png" />

                <meta name="og:url" property="og:url" content="https://www.QualityUnited Writers.com" />
            </Head>

            <div className="container mx-auto p-4">
                <Accordion />
            </div>
        </Layout>
    );
};

export default FAQ;
