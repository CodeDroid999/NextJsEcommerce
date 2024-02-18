import Navbar from 'components/layout/Navbar'
import AddBankAccount from 'components/payments/methods/AddBankAccount'
import AddBillingAddress from 'components/payments/methods/AddBillingAddress'
import UpdateBankAccount from 'components/payments/methods/UpdateBankAccount'
import UpdateBillingAddress from 'components/payments/methods/UpdateBillingAddress'
import { UserAuth } from 'context/AuthContext'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'

import React, { useEffect } from 'react'

export default function PaymentMethods() {
  const { user } = UserAuth()

  const router = useRouter()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push(`/`)
      }
    })
    return () => unsubscribe()
  }, [router])

  return (
    <div>
      <Navbar />
      <div className="mx-auto mt-28 max-w-[800px] px-3">
        <h1 className="text-4xl font-bold text-green-950">Payment Methods</h1>
        <div className="mt-5">
          <div>
            <h1 className="mb-1 text-2xl font-semibold text-green-950">
              Make Payments
            </h1>
            <p className="text-base  text-gray-800">
              When you are ready to accept a Taskers offer, you will be required
              to pay for the assignment. Payment will be held securely until the assignment
              is complete and you release payment to the Tutor.
            </p>
          </div>
          <div>
            <h1 className="mb-1 mt-2 text-2xl font-semibold text-green-950">
              Receive Payments
            </h1>
            <p className="text-base  text-gray-700">
              Once a job is completed, you will be able to request payment
              from the Job Student, who will then release it to your nominated
              account.
            </p>
          </div>
          <div className="mt-2">
            <h1 className="text-sm font-semibold uppercase text-green-950">
              billing address
            </h1>
            <div className="mt-1 w-full">
              {!user?.billingAddress ? (
                <AddBillingAddress />
              ) : (
                <div className="flex flex-col">
                  <span className="rounded-md bg-gray-100 p-3 text-base font-medium text-green-950">
                    {user?.billingAddress}
                  </span>

                  <UpdateBillingAddress
                    userId={user?.userId}
                    billingAddress={user?.billingAddress}
                  />
                </div>
              )}
            </div>
            <div className="mt-2">
              <h1 className="text-sm font-semibold uppercase text-green-950">
                bank account address
              </h1>
              <div>
                {!user?.bankAccount.accountHolderName ||
                !user?.bankAccount.accountNumber ||
                !user?.bankAccount.BSB ? (
                  <div>
                    <h1 className="mb-2">
                      Please provide your bank details so you can get paid. We
                      dont take any money from your account.
                    </h1>
                    <AddBankAccount />
                  </div>
                ) : (
                  <div className="">
                    <div className="mb-1 flex flex-col">
                      <h1 className="mt-2 font-medium text-green-950">
                        Account holder name
                      </h1>
                      <span className="mt-1 rounded-md bg-gray-100 p-3 text-base font-medium text-green-950">
                        {user?.bankAccount.accountHolderName}
                      </span>
                    </div>
                    <div className="mb-1 flex flex-col">
                      <h1 className="mt-2 font-medium text-green-950">
                        Account number
                      </h1>
                      <span className="mt-2 rounded-md bg-gray-100 p-3 text-base font-medium text-green-950">
                        {user?.bankAccount.accountNumber}
                      </span>
                    </div>
                    <div className="mb-1 flex flex-col">
                      <h1 className="mt-2 font-medium text-green-950">BSB</h1>
                      <span className="rounded-md bg-gray-100 p-3 text-base font-medium text-green-950">
                        {user?.bankAccount.BSB}
                      </span>
                    </div>
                    <UpdateBankAccount
                      userId={user?.userId}
                      bsb={user?.bankAccount.BSB}
                      accountHolderName={user?.bankAccount.accountHolderName}
                      accountNumber={user?.bankAccount.accountNumber}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
