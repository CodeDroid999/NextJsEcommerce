
import SideNav from 'components/layout/SideNav';
import Layout from 'components/unAuthed/layout';
import Link from 'next/link';
import React from 'react';

const ReferAFriend: React.FC = () => {
    return (
        <Layout>
            <div className="flex ">
                <div className="container flex">
                    <div className="text-white  h-full">
                        <SideNav />
                    </div>
                    <div className="mx-auto h-full pl-5">
                        <h1 className="text-blue-800 text-xl ">Refer a Friend</h1>
                        <h2>QualityUnitedWriters - Refer a Friend - Terms and Conditions</h2>

                        <p>
                            Our Refer a Friend Program is a great way to earn extra bonuses simply by telling others about QualityUnitedWriters.
                        </p>

                        <h3>Eligibility</h3>

                        <p>
                            <strong>A QualityUnitedWriters account holder can...</strong>
                            <ul>
                                <li>Find a unique referral link on their profile page.</li>
                                <li>Refer up to 10 friends — this offer is limited on a first-come, first-served basis. Referred friends must be completely new to QualityUnitedWriters.</li>
                                <li>Only have 1 QualityUnitedWriters account, which must have a problem-free history and can’t refer themselves — sorry!</li>
                                <li>Post the unique referral link on their personal social media pages or share it with their friends through private messages, chats, emails, etc.</li>
                            </ul>
                        </p>

                        <p>
                            <strong>Every referred friend can...</strong>
                            <ul>
                                <li>Join QualityUnitedWriters as a referred friend if they’ve never posted Homework on QualityUnitedWriters.com. They can start referring their own friends as soon as they have a QualityUnitedWriters account.</li>
                            </ul>
                        </p>

                        <h3>Let’s talk rewards</h3>

                        <p>
                            <strong>When referring friends, the QualityUnitedWriters account holder...</strong>
                            <ul>
                                <li>Earns — a.k.a. receives a one-time $5 USD bonus added to their account when a referred friend pays for their first Homework.</li>
                            </ul>
                        </p>

                        <p>
                            <strong>Each referred friend must...</strong>
                            <ul>
                                <li>Sign up at QualityUnitedWriters using a unique referral link.</li>
                            </ul>
                        </p>

                        <h3>About the rewards…</h3>

                        <p>
                            <ul>
                                <li>The bonus has no official monetary value and can’t be exchanged, transferred, redeemed, replaced, or refunded for proper cash. The QualityUnitedWriters account holder can use it as part or full payment for their Homework.</li>
                                <li>This $5 USD bonus is valid for 12 months.</li>
                                <li>Thinking of sharing your earnings? Sorry, they can’t be transferred from person to person.</li>
                            </ul>
                        </p>

                        <h3>What if…</h3>

                        <p>
                            <ul>
                                <li>Someone closes their account? Any leftover rewards will go back into QualityUnitedWriters’s piggy bank.</li>
                                <li>QualityUnitedWriters decides to gift a bonus or make an exception to the Terms and Conditions? This is rare, and the Terms and Conditions remain unchanged for all other instances.</li>
                                <li>Rules or incentives change or end? It’s not often, but this can happen. If it does, QualityUnitedWriters will reflect the changes here.</li>
                                <li>A referred friend or referring account holder has questions? QualityUnitedWriters will reply, and any decisions made will be at QualityUnitedWriters’s sole discretion.</li>
                                <li>Privacy is a concern? Rest easy — our Refer a Friend Program uses our website Privacy Policy and Terms & Conditions so everyone’s completely safe.</li>
                            </ul>
                        </p>

                        <p>
                            Want to start referring friends and earning?
                            <br />
                            <Link href="#your-signup-link">Dont have an account yet? Sign Up!</Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ReferAFriend;
