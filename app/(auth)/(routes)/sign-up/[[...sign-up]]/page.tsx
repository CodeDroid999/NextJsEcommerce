import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Head from 'next/head'
import axios from 'axios';
import { auth, db } from '@/firebase'
import AuthLayout from '@/components/layout/AuthLayout'


export default function Signup() {
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
        updateUserObject(user); // Update user object here
        router.push(`/setup-profile`)
      }
    })
    return () => unsubscribe()
  }, [router, redirect])
  const updateUserObject = async (user: any) => {
    // Your code to update the user object in the database
    try {
      const userRef = await addDoc(collection(db, 'users'), {
        userId: user.uid,
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        profilePicture: '',
        accountStatus: 'inActive',
        role: '',
        email: user.email,
        aboutDescription: '',
        postalCode: '',
        tag: '',
        city: '',
        skills: [],
        education: [],
        createdAt: serverTimestamp(),
      });
      // Add additional fields or data as needed
      console.log('User object updated successfully:', userRef.id);
    } catch (error) {
      console.error('Error updating user object:', error);
      // Handle error, show toast, or log it as needed
    }
  };


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()

    // Set the prompt option to force account selection
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const userRef = await addDoc(collection(db, 'users'), {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        profilePicture: '',
        billingAddress: '',
        role: '',
        email: user.email,
        userId: user.uid,
        bankAccount: {
          accountHolderName: '',
          accountNumber: '',
          BSB: '',
        },
        aboutDescription: '',
        postalCode: '',
        tag: '',
        city: '',
        skills: [],
        education: [],
        createdAt: serverTimestamp(),
      })
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  }
  const handleSignUp = async (event: any) => {
    event.preventDefault();
    let hasError = false;
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('Email entered is not valid');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Send verification email
      await sendEmailVerification(user);
      // Display success message to user
      toast.success('Verification email has been sent. Please check your inbox.');
      //send welcome message to user
      // Create user data for the HTTP request
      const userData = {
        firstName: '', // Fill in the user's first name
        lastName: '', // Fill in the user's last name
        email: user.email, // Use the user's email
      };

      // Make the HTTP request to the api/welcomeuser route
      await axios.post('/api/welcomeuser', userData);
      const userRef = await addDoc(collection(db, 'users'), {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        profilePicture: '',
        billingAddress: '',
        role: '',
        email: user.email,
        userId: user.uid,
        bankAccount: {
          accountHolderName: '',
          accountNumber: '',
          BSB: '',
        },
        aboutDescription: '',
        postalCode: '',
        tag: '',
        city: '',
        skills: [],
        education: [],
        createdAt: serverTimestamp(),
      });
      router.push('/setup-profile');
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        toast.error('User already exists. Please log in.');
      } else {
        toast.error('Error occurred:', errorMessage);
      }
    }
  };

  return (
    <AuthLayout>
      {/* Google Sign In button */}
      <div className="flex justify-center align-center pt-1 pb-2">
        <button
          type="button"
          className="flex w-100 flex-row items-center justify-center rounded-2xl border-1border-gray-400 bg-gray-100 px-8 py-2 text-lg font-medium text-green-950 hover:bg-green-900 hover:text-white"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="mr-2" size={20} />
          Continue with Google
        </button>
      </div>

      {/* OR separator */}
      <div className="text-center text-xs font-medium text-gray-700 pt-2 pb-2">OR</div>


      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
                  outline-none focus:border-blue-500`}
          />
          {emailError && <span className="text-red-500">{emailError}</span>}
        </div>

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
                  outline-none focus:border-blue-500 "
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-2 "
            >
              {passwordVisible ? (
                <BsEyeFill size={18} />
              ) : (
                <BsEyeSlashFill size={18} />
              )}
            </button>
          </div>
          {passwordError && (
            <span className="text-red-500">{passwordError}</span>
          )}
        </div>

        <button
          type="submit"
          className="rounded-2xl bg-green-900 hover:bg-green-900 px-4 py-2 text-white"
        >
          Sign Up
        </button>

        <div className="flex flex-row space-x-3 text-base font-normal justify-items-center items-center">
          <p className="pt-1 pb-2 text-lg">Already have an account?</p>
          <p className="font-medium text-green-500 hover:text-green-950 items-center">
            <Link href="/login">Log in</Link>
          </p>
        </div>

      </form>
    </AuthLayout>
  )
}
