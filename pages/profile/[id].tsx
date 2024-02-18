import Navbar from 'components/layout/Navbar'
import { auth, db } from '../../firebase'
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import profile from 'public/profile.jpeg'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { UserAuth } from 'context/AuthContext'
import PersonalInfoTab from 'components/profile/PersonalInfoTab'
import ReviewsTab from 'components/profile/Reviews/ReviewTab'
import EditProfilePicture from 'components/profile/EditProfilePicture'
import Bio from 'components/profile/BioTab'
import SkillsAndEducation from 'components/profile/SkillsTab'

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('en-us', { month: 'short' })
  const year = date.getFullYear()
  const suffix =
    day === 1 || day === 21 || day === 31
      ? 'st'
      : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
          ? 'rd'
          : 'th'
  return `${day}${suffix} ${month} ${year}`
}

export default function ProfilePage({
  children,
  hasNewNotifications,
}: {
  children: React.ReactNode
  hasNewNotifications: boolean
}) {
  const [assignments, setAssignments] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic') // Default tab is 'Personal Info tab'
  const [user, setUser] = useState(null)

  const router = useRouter()
  const userId = router.query.id?.toString()
  useEffect(() => {
    if (userId) {
      setLoading(true)
      setLoading(true)
      const q = query(collection(db, 'users'), where('userId', '==', userId))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          const userData = doc.data()
          userData.createdAt = formatDate(userData.createdAt.toDate())
          setUser(userData)
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      return () => {
        unsubscribe()
      }

      const assignmentsQuery = query(
        collection(db, 'users'),
        where('tutor.userId', '==', userId)
      )

      // Create a query for reviews
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('tutorId', '==', userId)
      )

      // Fetch assignments
      const assignmentsPromise = getDocs(assignmentsQuery).then((assignmentQuerySnapshot) => {
        const assignments = assignmentQuerySnapshot.docs.map((doc) => {
          const data = doc.data()
          // Additional processing for assignment data if needed
          return { id: doc.id, ...data }
        })
        return assignments
      })

      // Fetch reviews
      const reviewsPromise = getDocs(reviewsQuery)
        .then((reviewQuerySnapshot) => {
          const reviews = reviewQuerySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
          })
          return reviews
        })
        .then((reviews) => {
          // Fetch sender data for each review
          const senderPromises = reviews.map((review: any) =>
            getDocs(
              query(
                collection(db, 'users'),
                where('userId', '==', review.senderId)
              )
            ).then((senderSnapshot) => {
              const senderData = senderSnapshot.docs[0].data()
              return { ...review, reviewer: senderData }
            })
          )

          return Promise.all(senderPromises)
        })

      // Wait for both promises to resolve
      Promise.all([assignmentsPromise, reviewsPromise])
        .then(([assignments, reviews]) => {
          setAssignments(assignments)
          setReviews(reviews)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }, [userId])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const completedAssignments = assignments.filter((assignment) => assignment.status === 'Completed')
  const myTutorReviews = reviews.filter(
    (review) => review.senderId !== review.tutorId
  )
  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="mt-20 bg-gray-100 pt-10 antialiased">
          <div className="container mx-auto">
            <div className="flex flex-row p-3 ">
              <div className="flex w-full rounded bg-blue-100 p-3 ">
                <div
                  className="flex flex-col justify-center "
                  style={{ width: '20vw' }}
                >
                  <div className="flex justify-center">
                    <Image
                      src={user?.profilePicture || profile}
                      alt="profile picture"
                      height={200}
                      width={200}
                      className="mr-2 h-[120px] w-[120px] rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <EditProfilePicture />
                  </div>
                </div>
                <div className="justify-right flex min-h-full w-full flex-col p-3">
                  <p className="text-left text-xl font-bold text-blue-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="mt-2 rounded  p-1 text-left text-sm font-medium text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-1">
              <div className="my-1">
                <div className="flex items-center justify-center">
                  <div className="mx-3  mb-2 w-full justify-center rounded-lg bg-blue-100 text-white">
                    <h3 className="p-3 text-lg text-gray-900 md:text-2xl lg:text-2xl">
                      Stats
                    </h3>
                    {/* ... (user stats content) */}
                    <div className="flex flex-wrap items-center  justify-center gap-2 p-5 pt-1">
                      <div className="w-42 h-42  flex-auto rounded-lg  bg-gradient-to-r from-gray-800    to-gray-700    shadow-lg">
                        <div className="p-4 md:p-7">
                          <h2 className="text-center text-xl capitalize text-gray-200">
                            {completedAssignments.length}
                          </h2>
                          <h3 className="text-center  text-sm  text-gray-400">
                            completed
                          </h3>
                        </div>
                      </div>
                      <div className="w-42 h-42 flex-auto rounded-lg  bg-gradient-to-r from-gray-800    to-gray-700    shadow-lg">
                        <div className="p-4 md:p-7">
                          <h2 className="text-center text-xl capitalize text-gray-200">
                            {assignments.length}
                          </h2>
                          <h3 className="text-center  text-sm  text-gray-400">
                            Homeworks Assigned
                          </h3>
                        </div>
                      </div>

                      <div className="w-42 h-42  flex-auto rounded-lg  bg-gradient-to-r from-gray-800    to-gray-700    shadow-lg">
                        <div className="p-4 md:p-7">
                          <h2 className="text-center text-lg capitalize text-gray-200">
                            {myTutorReviews.length}
                          </h2>
                          <h3 className="text-center  text-sm  text-gray-400">
                            Reviews
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-5 flex items-center justify-between space-x-1 px-6">
                  <button
                    className={`${activeTab === 'basic' ? 'bg-gray-200' : ''
                      } w-full whitespace-nowrap border-2 rounded hover:shadow-2xl py-3 text-center text-sm font-medium text-green-950 transition duration-150 ease-in hover:text-gray-900`}
                    onClick={() => handleTabClick('basic')}
                  >
                    Personal Info
                  </button>
                  <button
                    className={`${activeTab === 'skills' ? 'bg-gray-100' : ''
                      } w-full whitespace-nowrap border-2 rounded hover:shadow-2xl py-3 text-center text-sm font-medium text-green-950 transition duration-150 ease-in hover:text-gray-900`}
                    onClick={() => handleTabClick('skills')}
                  >
                    Skills & Education
                  </button>
                  <button
                    className={`${activeTab === 'bio' ? 'bg-gray-100' : ''
                      } w-full whitespace-nowrap border-2 rounded hover:shadow-2xl py-3 text-center text-sm font-medium text-green-950 transition duration-150 ease-in hover:text-gray-900`}
                    onClick={() => handleTabClick('bio')}
                  >
                    Bio
                  </button>
                  <button
                    className={`${activeTab === 'reviews' ? 'bg-gray-100' : ''
                      } w-full whitespace-nowrap border-2 rounded hover:shadow-2xl py-3 text-center text-sm font-medium text-green-950 transition duration-150 ease-in hover:text-gray-900`}
                    onClick={() => handleTabClick('reviews')}
                  >
                    Reviews
                  </button>
                </div>

                {activeTab === 'basic' && (
                  <div className="w-full p-4">
                    {/* Content for the Personal Info tab */}
                    <PersonalInfoTab />
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="w-full p-4">
                    {/* Content for the Skills & Education tab */}
                    <SkillsAndEducation />
                  </div>
                )}

                {activeTab === 'bio' && (
                  <div className="w-full p-4">
                    {/* Content for the Languages tab */}
                    <Bio />
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="w-full p-4">
                    {/* Content for the Reviews tab */}
                    <ReviewsTab reviews={myTutorReviews} />
                  </div>
                )}

                {/* ... (other code) */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
