import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
import Head from 'next/head'
import { auth, db } from '@/firebase'
import AuthLayout from '@/components/layout/AuthLayout'

export default function Page() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get the user's role from the database
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              const role = userData.role;

              // Redirect the user based on their role
              if (role === 'Admin') {
                router.push('/admin/dashboard');
              } else if (role === 'Student') {
                router.push('/post-assignment');
              } else if (role === 'Tutor') {
                router.push('/dashboard');
              } else {
                router.push(redirect || '/');
              }
            } else {
              router.push(redirect || '/');
            }
          })
          .catch((error) => {
            console.error('Error getting user data:', error);
            router.push(redirect || '/');
          });

        toast.success('Logged In');
      }
    });

    return () => unsubscribe();
  }, [redirect, router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    // Set the prompt option to force account selection
    provider.setCustomParameters({
      prompt: 'select_account',
    });
  
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
  
      const googleUserId = user.uid
  
      const userDocRef = doc(db, 'users', googleUserId)
      const userDocSnapshot = await getDoc(userDocRef)
  
      if (!userDocSnapshot.exists()) {
        const userRef = await addDoc(collection(db, 'users'), {
          userId: user.uid,
          displayName: '',
          phoneNumber: '',
          profilePicture: '',
          accountStatus: 'inActive',
          role: '',
          email: user.email,
          createdAt: serverTimestamp(),
        })
      }
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
    }
  }
  

  const handleSignIn = async (event: any) => {
    event.preventDefault();

    // Reset error messages
    setEmailError('');
    setPasswordError('');

    try {
      if (!email || !email.includes('@')) {
        throw new Error('Email is not valid');
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Display success message to user
      toast.success('Logged In');

      // Your existing code for making HTTP request to '/api/welcomeuser'
    } catch (error) {
      console.error('Error during sign-in:', error);

      if (error instanceof Error) {
        const errorMessage = error.message;

        if (errorMessage === 'auth/user-not-found' || errorMessage === 'auth/wrong-password') {
          toast.error('Invalid email or password. Please try again.');
        } else {
          toast.success(`Welcome back!`);
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      <Head>
        <title>QualityUnitedWriters - Your Academic Research and Project Partner</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Discover a dedicated platform for students and tutors offering expert assistance in a wide range of academic research and projects. Quality United Writers connects you with quality solutions for your educational needs. Whether you're seeking help with essays, theses, or any academic work, our talented team is here to assist you."
        />
        <meta
          name="keywords"
          content="Academic writing services, Expert academic writers, Professional research assistance, High-quality research papers, Academic project support, Thesis and dissertation help, Essay writing service, Top-rated tutors, Academic success tips, Homework assistance, Online tutoring, Quality writing solutions, Best essay writers, Custom research papers, Academic support platform, Tutoring for students, Research paper editing, Writing and editing services, Academic guidance, Homework help for students"
        />
        <meta name="author" content="QualityUnitedWriters" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="QualityUnitedWriters - Your Academic Research and Project Partner"
        />
        <meta
          property="og:description"
          content="Discover a dedicated platform for students and tutors offering expert assistance in a wide range of academic research and projects. Quality United Writers connects you with quality solutions for your educational needs. Whether you're seeking help with essays, theses, or any academic work, our talented team is here to assist you."
        />
        <meta property="og:image" content="/sync-my-socials-logo.png" />
        <meta property="og:url" content="https://www.qualityunitedswriters.com" />
      </Head>

      {/* Google Sign In button */}
      <div className="flex justify-center align-center pt-1 pb-2">
        <button
          type="button"
          className="flex w-100 flex-row items-center justify-center rounded-2xl border-1border-gray-400 bg-gray-100 px-8 py-2 text-lg font-medium text-green-950 hover:bg-green-900 hover:text-white"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="mr-2" size={20} />
          Log in with Google
        </button>
      </div>

      {/* OR separator */}
      <div className="text-center text-xs font-medium text-gray-700 pt-2 pb-2">OR</div>

      {/* Sign In form */}
      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        {/* Email input */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className={`h-full w-full rounded-lg border-1bg-gray-50 p-2
                  outline-none focus:border-green-500`}
          />
          {emailError && <span className="text-red-500">{emailError}</span>}
        </div>

        {/* Password input */}
        <div className="relative flex flex-col">
          <label htmlFor="password" className="mb-1 font-medium text-gray-700">
            Password
          </label>

          <div className="flex items-center">
            <input
              id="password"
              name="password"
              placeholder="Password"
              type={passwordVisible ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              className="h-full w-full rounded-lg border-1bg-gray-50 p-2
                  outline-none focus:border-green-500 "
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-2 "
            >
              {passwordVisible ? <BsEyeFill size={18} /> : <BsEyeSlashFill size={18} />}
            </button>
          </div>
          {passwordError && <span className="text-red-500">{passwordError}</span>}
        </div>

        {/* Continue button */}
        <button
          type="submit"
          className="rounded-2xl bg-green-900 px-4 py-2 text-white hover:bg-green-900"
        >
          Continue
        </button>

        {/* Sign up link */}
        <div className="flex flex-row space-x-3 text-base font-normal items-center">
          <p className="pt-1 pb-2 text-lg">Dont have an account?</p>
          <p className="font-medium text-green-900">
            <Link href={`/signup?redirect=${redirect}`}>Sign up</Link>
          </p>
        </div>

        {/* Forgot password button */}
        <button className="rounded-2xl bg-green-900 px-4 py-2 text-white hover:bg-green-900">
          <Link href="/forgot-password">Forgot password?</Link>
        </button>
      </form>
    </AuthLayout>
  )
}
