import { UserAuth } from 'context/AuthContext'
import { db, auth } from '../../firebase'
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import Navbar from 'components/layout/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import profile from 'public/profile.jpeg'

export default function Notifications() {
  const { user } = UserAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const userId = router.query.id?.toString() || ''

  useEffect(() => {
    if (userId) {
      setLoading(true)
      const notificationsRef = collection(db, 'notifications')

      // Fetch user's notifications
      const notificationsQuery = query(
        notificationsRef,
        where('receiverId', '==', userId)
      )

      const unsubscribe = onSnapshot(
        notificationsQuery,
        async (querySnapshot) => {
          const notificationsData = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const senderSnapshot = await getDocs(
                query(
                  collection(db, 'users'),
                  where('userId', '==', doc.data().senderId)
                )
              )
              const senderData = senderSnapshot.docs[0].data()

              return {
                id: doc.id,
                ...doc.data(),
                senderDetails: senderData,
              }
            })
          )

          // Update the state with all notifications
          notificationsData?.sort((a: any, b: any) => b.createdAt - a.createdAt)
          setNotifications(notificationsData)

          // Mark unread notifications as read
          const unreadNotifications = notificationsData.filter(
            (notification: any) => !notification.read
          )

          const updatePromises = unreadNotifications.map(
            async (notification) => {
              const notificationRef = doc(db, 'notifications', notification.id)
              await updateDoc(notificationRef, { read: true })
            }
          )

          // Wait for all updates to complete
          await Promise.all(updatePromises).catch((error) => {
            console.error('Error marking notifications as read:', error)
          })

          setLoading(false)
        }
      )

      // Fetch unread notifications and mark them as read on initial load
      ;(async () => {
        const unreadQuerySnapshot = await getDocs(
          query(
            notificationsRef,
            where('receiverId', '==', userId),
            where('read', '==', false)
          )
        )

        const unreadNotifications = unreadQuerySnapshot.docs.map(
          (doc) => doc.ref
        )
        const batch = writeBatch(db)

        unreadNotifications.forEach((notificationRef) => {
          batch.update(notificationRef, { read: true })
        })

        await batch.commit()
      })()

      return () => {
        unsubscribe()
      }
    }
  }, [userId])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push(`/`)
      }
    })
    return () => unsubscribe()
  }, [router])

  function timeAgo(timestamp: any) {
    const now = new Date()
    const createdDate = timestamp.toDate()
    const timeDifference = now.getTime() - createdDate.getTime()

    if (timeDifference < 60000) {
      // Less than 1 minute
      return 'Just now'
    } else if (timeDifference < 3600000) {
      // Less than 1 hour
      const minutes = Math.floor(timeDifference / 60000)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (timeDifference < 86400000) {
      // Less than 1 day
      const hours = Math.floor(timeDifference / 3600000)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (timeDifference < 604800000) {
      // Less than 1 week
      const days = Math.floor(timeDifference / 86400000)
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (timeDifference < 31536000000) {
      // Less than 1 year
      const weeks = Math.floor(timeDifference / 604800000)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else {
      const years = Math.floor(timeDifference / 31536000000)
      return `${years} year${years > 1 ? 's' : ''} ago`
    }
  }

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
      ) : notifications.length === 0 ? (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg font-semibold text-green-950 xl:text-2xl ">
            You dont have any notifications
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-24 max-w-[700px] px-3">
          <h1 className="mb-3 text-3xl font-bold text-green-950">
            Notifications
          </h1>
          <ul className="mt-5">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="my-4 rounded-xl bg-gray-100 p-2"
              >
                <div className="flex w-full flex-row items-center">
                  <div>
                    <Image
                      src={notification.senderDetails.profilePicture || profile}
                      width={40}
                      height={40}
                      alt="profile"
                      className="h-[40px] w-[40px] rounded-full object-cover"
                    />
                  </div>
                  <h1 className="ml-2 flex-1 text-sm font-medium">
                    <span className="text-blue-700">
                      {notification.senderDetails.firstName}{' '}
                      {notification.senderDetails.lastName}
                    </span>
                    <span className=""> {notification.content}</span>

                    <span className="ml-1.5 text-blue-700">
                      <Link href={`/assignments/${notification.assignmentId}`}>
                        {notification.assignmentTitle}
                      </Link>
                    </span>
                  </h1>
                </div>
                <div className="my-0.5 flex flex-row justify-end text-xs font-medium text-gray-700">
                  <span>{timeAgo(notification.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
