import Navbar from 'components/layout/Navbar'
import { db } from '../../firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,

  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { UserAuth } from 'context/AuthContext'
import { formatDate } from 'pages/profile/[id]'
import MakeOffer from 'components/offers/MakeOffer'
import UpdateOffer from 'components/offers/UpdateOffer'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import WithdrawOffer from 'components/offers/WithdrawOffer'
import Image from 'next/image'
import profile from 'public/profile.jpeg'
import AcceptOffer from 'components/offers/AcceptOffer'
import NewMessage from 'components/messaging/NewMessage'
import Replies from 'components/offers/Replies'
import RequestPayment from 'components/payments/RequestPayment'
import ReleasePayment from 'components/payments/ReleasePayment'
import AddReview from 'components/reviews/AddReview'
import TaskReviews from 'components/reviews/TaskReviews'
import Link from 'next/link'
import UpdateTask from 'components/tasks/UpdateTask'
import CancelTask from 'components/tasks/CancelTask'
import TaskerRating from 'components/reviews/TaskerRating'

export default function TaskDetails(props: any) {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(false)
  const { assignmentData, tutorDetails, studentDetails } = props
  const { user } = UserAuth()
  const router = useRouter()
  const assignmentId = router.query.id.toString()
  const student = studentDetails

  useEffect(() => {
    setLoading(true)
    const offersCollectionRef = collection(db, 'assignments', assignmentId, 'offers')
    const unsubscribe = onSnapshot(offersCollectionRef, async (snapshot) => {
      const updatedOffers: any = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const offerData = doc.data()
          const customerSnapshot = await getDocs(
            query(
              collection(db, 'users'),
              where('userId', '==', offerData.userId)
            )
          )
          const customerDoc = customerSnapshot.docs[0]
          const customerData = customerDoc.data()

          return {
            offerId: doc.id,
            ...offerData,
            customer: customerData,
          }
        })
      )
      updatedOffers?.sort((a: any, b: any) => b.createdAt - a.createdAt)
      setOffers(updatedOffers)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [assignmentId])

  const withdrawOffer = async (offerId: string) => {
    try {
      await deleteDoc(doc(db, 'assignments', assignmentId, 'offers', offerId))
      await addDoc(collection(db, 'notifications'), {
        receiverId: assignmentData.student.userId,
        senderId: user.userId,
        type: 'Withdraw Bid',
        content: 'has withdrawn offer on',
        assignmentTitle: assignmentData.title,
        assignmentId,
        read: false,
        createdAt: serverTimestamp(),
      })
      await addDoc(collection(db, 'mail'), {
        to: student?.email,
        message: {
          subject: 'Bid Withdrawn',
          html: `${user?.firstName} has withdrawn offer made on ${assignmentData.title}`,
        },
      })
      toast.success('Bid has been withdrawn')
    } catch (error) {
      console.error('Error withdrawing offer:', error)
    }
  }

  return (
    <div>
      <Navbar />

      <div className="mt-28 mx-4">
        <div className="w-full">
          {/**Status */}
          <div className="flex max-w-[130px] justify-center rounded-full bg-green-900  p-1  text-xs font-bold uppercase text-green-950">
            Bidding: {assignmentData.status}
          </div>

          <div className="mt-3 flex flex-col md:flex-row md:justify-between">
            <div>
              {/**post title */}
              <div className="mt-2">
                <h1 className="text text-2xl font-bold text-green-950 sm:text-3xl xl:text-4xl">
                  {assignmentData.title}
                </h1>
              </div>
              {/**Post details */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold uppercase text-green-950">
                    Posted
                  </h4>
                  {/**
                  <p className="text-lg font-medium text-green-950">
                    {student.firstName} {student.lastName}
  </p>**/}
                  <p className="text-sm font-medium text-green-950">
                    On {assignmentData.createdAt}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold uppercase text-green-950">
                    Due Date
                  </h4>
                  <p className="text-sm font-semibold text-green-950">
                    {formatDate(assignmentData.dueDate)}
                  </p>
                </div>
              </div>
            </div>

            {/**Bid */}
            <div className="mt-4 w-full max-w-screen-sm md:ml-6 md:mt-0 md:max-w-[300px] ">
              <div className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-2xl bg-gray-100 p-3 ">
                <div className="flex flex-col items-center justify-center pb-4">
                  <h1 className="text-xs font-bold uppercase text-green-950">
                    Order Budget
                  </h1>
                  <p className="text-5xl font-bold text-green-950">
                    ${assignmentData.budget}
                  </p>
                </div>

                {user && assignmentData.student.userId === user?.userId && (
                  <div className="w-full">
                    {assignmentData.status === 'Open' && (
                      <UpdateTask assignmentId={assignmentId} assignmentData={assignmentData} />
                    )}
                    {(assignmentData.status === 'Open' ||
                      assignmentData.status === 'Assigned') && (
                        <CancelTask
                          assignmentId={assignmentId}
                          assignmentData={assignmentData}
                          tutor={tutorDetails}
                        />
                      )}
                    {assignmentData.status === 'Cancelled' && (
                      <div className="rounded-full bg-white px-4 py-2 text-center font-semibold uppercase text-blue-950">
                        {assignmentData.status}
                      </div>
                    )}
                    {assignmentData.paymentReleased ? (
                      !assignmentData.studentReview ? (
                        <AddReview
                          tutorDetails={tutorDetails}
                          assignmentId={assignmentId}
                          student={student}
                          assignmentData={assignmentData}
                        />
                      ) : (
                        <div className="rounded-full bg-white px-4 py-2 text-center font-semibold uppercase text-blue-800">
                          {assignmentData.status}
                        </div>
                      )
                    ) : (
                      assignmentData.paymentRequested &&
                      assignmentData.status === 'Assigned' && (
                        <ReleasePayment
                          assignmentData={assignmentData}
                          tutorDetails={tutorDetails}
                          student={student}
                          assignmentId={assignmentId}
                        />
                      )
                    )}
                  </div>
                )}

                {user && assignmentData.student.userId !== user?.userId && (
                  <div className="w-full">
                    {assignmentData.status === 'Open' ? (
                      offers.some(
                        (offer: any) => offer.userId === user.userId
                      ) ? (
                        offers.map((offer: any) => {
                          if (offer.userId === user.userId) {
                            return (
                              <div key={offer.offerId}>
                                <div className="rounded-full bg-white p-2 text-center font-medium text-blue-400 ">
                                  You bidded ${offer.amount}
                                </div>
                                <div className="my-3 w-full text-sm">
                                  <div className="flex flex-row items-center justify-between font-medium text-green-950">
                                    <span>Service fee</span>
                                    <span>-${offer.serviceFee}</span>
                                  </div>
                                  <div className="flex flex-row items-center justify-between font-medium text-green-950">
                                    <span>You will receive</span>
                                    <span>${offer.finalPrice}</span>
                                  </div>
                                </div>
                                <UpdateOffer
                                  proposal={offer.proposal}
                                  offerId={offer.offerId}
                                  student={studentDetails}
                                  studentId={student.userId}
                                  assignmentTitle={assignmentData.title}
                                />
                              </div>
                            )
                          }
                          return null
                        })
                      ) : (
                        <MakeOffer
                          studentId={assignmentData.student.userId}
                          assignmentTitle={assignmentData.title}
                          student={studentDetails}
                        />
                      )
                    ) : assignmentData.tutor.userId === user?.userId ? (
                      <div>
                        {assignmentData.paymentRequested &&
                          (assignmentData.status === 'Assigned' ||
                            assignmentData.status === 'Completed') ? (
                          <div>
                            <div className="flex flex-row items-center justify-between text-sm font-medium text-green-950">
                              <span>Your Bid</span>
                              <span>${assignmentData.tutor.price}</span>
                            </div>
                            <div className="flex flex-row items-center justify-between text-sm font-medium text-green-950">
                              <span>Service fee</span>
                              <span>-${assignmentData.tutor.serviceFee}</span>
                            </div>
                            <div className="flex flex-row items-center justify-between text-base font-medium text-green-950">
                              <span>Earned</span>
                              <span>${assignmentData.tutor.finalPrice}</span>
                            </div>
                            {assignmentData.status === 'Completed' ? (
                              <div className="mt-3 rounded-full bg-white px-4 py-2 text-center font-semibold uppercase text-blue-800">
                                {assignmentData.status}
                              </div>
                            ) : (
                              <div className="mt-3 rounded-full bg-white px-4 py-2 text-center text-base font-semibold  text-green-950">
                                Awaiting Payment
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {assignmentData.status === 'Assigned' && (
                              <div>
                                <div className="my-3 w-full text-sm">
                                  <div className="flex flex-row items-center justify-between font-medium text-green-950">
                                    <span>Your Bid</span>
                                    <span>${assignmentData.tutor.price}</span>
                                  </div>
                                  <div className="flex flex-row items-center justify-between font-medium text-green-950">
                                    <span>Service fee</span>
                                    <span>-${assignmentData.tutor.serviceFee}</span>
                                  </div>
                                  <div className="flex flex-row items-center justify-between font-medium text-green-950">
                                    <span>You will receive</span>
                                    <span>${assignmentData.tutor.finalPrice}</span>
                                  </div>
                                </div>
                                <RequestPayment
                                  assignmentData={assignmentData}
                                  student={student}
                                  assignmentId={assignmentId}
                                />
                              </div>
                            )}
                            {assignmentData.status === 'Cancelled' && (
                              <div>
                                <div className="rounded-full bg-white px-4 py-2 text-center font-semibold uppercase text-blue-950">
                                  {assignmentData.status}
                                </div>
                                <button
                                  onClick={() => router.push('/contact-us')}
                                  className="mt-2 w-full rounded-full bg-green-900 px-4 py-2 text-center font-semibold uppercase text-white"
                                >
                                  Contact Support
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {!assignmentData.tutorReview &&
                          assignmentData.status === 'Completed' && (
                            <div className="mt-5">
                              <AddReview
                                tutorDetails={tutorDetails}
                                assignmentId={assignmentId}
                                student={student}
                                assignmentData={assignmentData}
                              />
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="rounded-full bg-white px-4 py-2 text-center font-semibold uppercase text-green-950">
                        {assignmentData.status}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-semibold text-green-950">Summary</h1>
            <p className="flex-1 border-1border-green-800 bg-gray-100 rounded text-base font-medium text-gray-700 p-2">
              {assignmentData.description}
            </p>
          </div>
          <div className="mt-4">
            {loading ? (
              <div className="mt-24 flex items-center justify-center">
                <div
                  className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : offers.length > 0 ? (
              assignmentData.status === 'Assigned' ||
                assignmentData.status === 'Completed' ? (
                <div className="my-3">
                  {tutorDetails && (
                    <div>
                      <h1 className="mb-2 text-lg font-semibold uppercase text-blue-900">
                        Assigned to:
                      </h1>

                      <div className="flex flex-1 flex-row items-start">
                        <Link href={`/public-profile/${tutorDetails?.userId}`}>
                          <Image
                            src={tutorDetails?.profilePicture || profile}
                            alt="profile"
                            width={45}
                            height={45}
                            className="h-[45px] w-[45px] cursor-pointer rounded-full object-cover"
                          />
                        </Link>
                        <div className="ml-2 flex flex-col ">
                          <Link
                            href={`/public-profile/${tutorDetails?.userId}`}
                          >
                            <h1 className="cursor-pointer text-lg font-medium text-green-950">
                              {tutorDetails?.firstName}{' '}
                              {tutorDetails?.lastName}
                            </h1>
                          </Link>
                          <TaskerRating userId={tutorDetails?.userId} />
                        </div>
                      </div>

                      <div className="mt-3 w-full rounded-xl bg-gray-200 p-3 font-medium text-gray-800">
                        {assignmentData.tutor.proposal}
                      </div>
                      {user &&
                        (assignmentData.student.userId === user.userId ||
                          assignmentData.tutor.userId === user.userId) && (
                          <div className="mt-3">
                            <h1 className="mb-2 text-xs font-bold uppercase text-green-950">
                              Private messages
                            </h1>
                            <NewMessage
                              customerId={tutorDetails?.userId}
                              studentId={student.userId}
                              assignmentData={assignmentData}
                              assignmentId={assignmentId}
                              tutor={tutorDetails}
                              student={student}
                            />
                          </div>
                        )}
                      <TaskReviews assignmentId={assignmentId} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="my-3">
                  {assignmentData.status === 'Open' && (
                    <div>
                      <h1 className="mb-2 text-2xl font-semibold text-green-950">
                        Bids
                      </h1>
                      {offers.map((offer: any) => (
                        <div key={offer.offerId} className="mb-1 ">
                          <div className="flex w-full flex-row items-center justify-between">
                            <div className="flex flex-1 flex-row items-start">
                              <Link
                                href={`/public-profile/${offer.customer.userId}`}
                              >
                                <Image
                                  src={offer.customer.profilePicture || profile}
                                  alt="profile"
                                  width={45}
                                  height={45}
                                  className="h-[45px] w-[45px] cursor-pointer rounded-full object-cover"
                                />
                              </Link>
                              <div className="ml-2 flex flex-col ">
                                <Link
                                  href={`/public-profile/${offer.customer.userId}`}
                                >
                                  <h1 className="cursor-pointer text-lg font-medium text-green-950">
                                    {offer.customer.firstName}{' '}
                                    {offer.customer.lastName}
                                  </h1>
                                </Link>
                                <TaskerRating userId={offer.customer.userId} />
                              </div>
                            </div>

                            {user && offer.userId === user.userId && (
                              <div className="flex flex-1 flex-row items-center justify-end space-x-4">
                                <div className="text-xl font-semibold text-green-950">
                                  ${offer.amount}
                                </div>

                                <WithdrawOffer
                                  cancelOffer={() =>
                                    withdrawOffer(offer.offerId)
                                  }
                                />
                              </div>
                            )}

                            {user &&
                              assignmentData.status === 'Open' &&
                              assignmentData.student.userId === user.userId && (
                                <div className="flex flex-1 flex-row items-center justify-end space-x-4">
                                  <div className="text-2xl font-semibold text-green-950">
                                    ${offer.amount}
                                  </div>
                                  <div className="w-[100px]">
                                    <AcceptOffer
                                      assignmentData={assignmentData}
                                      offer={offer}
                                      student={studentDetails}
                                    />
                                  </div>
                                </div>
                              )}
                          </div>

                          <div className="mt-2 w-full rounded-xl bg-gray-200 p-2 font-medium text-gray-800">
                            {offer.proposal}
                          </div>
                          <div>
                            <Replies
                              customerId={offer.userId}
                              studentId={student.userId}
                              assignmentData={assignmentData}
                              assignmentId={assignmentId}
                              offerId={offer.offerId}
                              student={student}
                              customer={offer.customer}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            ) : (
              <div>
                {assignmentData.status === 'Open' && (
                  <p className="mt-12 text-center text-lg font-semibold text-green-950 ">
                    No bids yet!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const assignmentId = params.id

  const docRef = doc(db, 'assignments', assignmentId)
  const docSnap = await getDoc(docRef)

  const assignmentData = docSnap.data()
  assignmentData.createdAt = formatDate(assignmentData.createdAt.toDate())

  const studentSnapshot = await getDocs(
    query(
      collection(db, 'users'),
      where('userId', '==', assignmentData.student.userId)
    )
  )

  const studentDetails = studentSnapshot.docs[0].data()
  studentDetails.createdAt = formatDate(studentDetails.createdAt.toDate())

  const tutorSnapshot = await getDocs(
    query(
      collection(db, 'users'),
      where('userId', '==', assignmentData.tutor.userId)
    )
  )

  const tutorDetails = tutorSnapshot.docs[0]?.data() || null
  if (tutorDetails) {
    tutorDetails.createdAt = formatDate(tutorDetails.createdAt.toDate())
  }

  return {
    props: {
      assignmentData,
      studentDetails,
      tutorDetails,
    },
  }
}
