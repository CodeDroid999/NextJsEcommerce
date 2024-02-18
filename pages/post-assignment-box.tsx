import React, { useState, useEffect } from 'react'
import Step1 from 'components/forms/Step1'
import Step2 from 'components/forms/Step2'
import Step3 from 'components/forms/Step3'
import { TfiClose } from 'react-icons/tfi'
import { useRouter } from 'next/navigation'
import useFormStore from 'store/store'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export default function PostAssignmentBox() {
  const [step, setStep] = useState(1)
  const clearData = useFormStore((state) => state.clearStore)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push(`/login?redirect=/post-assignment`)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1)
  }

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const handleExit = () => {
    clearData()
    router.push('/')
  }
  return (
    <div className="mx-auto w-full  bg-green-400 ">
      <div className="mx-auto mt-20 p-5 ">
        {step === 1 && <Step1 handleNextStep={handleNextStep} />}
        {step === 2 && (
          <Step2
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
          />
        )}
        {step === 3 && <Step3 handlePreviousStep={handlePreviousStep} />}
      </div>
    </div>
  )
}
