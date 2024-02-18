import Navbar from 'components/layout/Navbar'
import { UserAuth } from 'context/AuthContext'
import { db } from '../../../firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function MobileNumber() {
  const { user } = UserAuth()
  const userId = user?.userId

  const [number, setNumber] = useState(user?.phoneNumber)
  const [phoneNumberError, setPhoneNumberError] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    let hasError = false
    if (!number) {
      setPhoneNumberError('* This field is required')
      hasError = true
    }

    if (hasError) {
      return
    }

    const q = query(collection(db, 'users'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const docSnapshot = querySnapshot.docs[0]
      const userDocRef = doc(db, 'users', docSnapshot.id)
      await updateDoc(userDocRef, {
        phoneNumber: number,
      })
    }
    toast.success('Phone number updated')
  }

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-28 max-w-[800px] px-3">
        <h1 className="mb-3 text-2xl font-semibold text-blue-950">
          Mobile Number
        </h1>
        <div className="flex flex-col">
          <input
            placeholder="Enter your mobile number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="h-16 w-full rounded-lg bg-gray-50 p-2 text-gray-700 outline-none focus:outline-blue-950"
          />
          {phoneNumberError && (
            <span className="text-red-500 ">{phoneNumberError}</span>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-3 rounded-full bg-blue-700 px-4 py-1.5 font-medium text-white"
        >
          {!user?.phoneNumber ? 'Save Number' : 'Update Number'}
        </button>
      </div>
    </div>
  )
}
