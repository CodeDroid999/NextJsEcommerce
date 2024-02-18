import Image from 'next/image'
import { db } from '../../firebase'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { MdArrowBack, MdSend } from 'react-icons/md'
import { UserAuth } from 'context/AuthContext'
import SendFile from 'components/messaging/SendFile'
import { formatDate } from 'components/profile/PersonalInfoTab'

export default function ChatRoom() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [receiverId, setReceiverId] = useState('')
  const [receiver, setReceiver] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = UserAuth()
  const router = useRouter()

  const chatId = router.query.id?.toString() || ''
  const userId = user?.userId

  useEffect(() => {
    if (chatId) {
      const messagesCollectionRef = collection(db, 'chats', chatId, 'messages')

      const unsubscribe = onSnapshot(
        messagesCollectionRef,
        async (snapshot) => {
          const updatedMessages: any = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const messageData = doc.data()
              const senderSnapshot = await getDocs(
                query(
                  collection(db, 'users'),
                  where('userId', '==', messageData.senderId)
                )
              )
              const senderData = senderSnapshot.docs[0].data()

              return {
                messageId: doc.id,
                ...messageData,
                senderDetails: senderData,
              }
            })
          )

          updatedMessages.sort(
            (a: any, b: any) =>
              a.timestamp?.toMillis() - b.timestamp?.toMillis()
          )

          setMessages(updatedMessages)

          const unreadMessages = updatedMessages.filter(
            (message: any) => !message.read && message.receiverId === userId
          )

          const updatePromises = unreadMessages.map(async (message: any) => {
            const messageRef = doc(
              db,
              'chats',
              chatId,
              'messages',
              message.messageId
            )
            await updateDoc(messageRef, { read: true })
          })

          // Wait for all updates to complete
          await Promise.all(updatePromises).catch((error) => {
            console.error('Error marking messages as read:', error)
          })
        }
      )

      return () => {
        unsubscribe()
      }
    }
  }, [chatId, userId])

  useEffect(() => {
    if (chatId) {
      const chatRef = doc(db, 'chats', chatId)

      const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
        const chatData = docSnapshot.data()

        const otherParticipantId = chatData.participants.find(
          (participantId: string) => participantId !== userId
        )
        setReceiverId(otherParticipantId)
      })

      return () => {
        unsubscribe()
      }
    }
  }, [chatId, userId])

  useEffect(() => {
    if (receiverId) {
      setLoading(true)
      const q = query(
        collection(db, 'users'),
        where('userId', '==', receiverId)
      )
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          const userData = doc.data()
          userData.createdAt = formatDate(userData.createdAt.toDate())
          setReceiver(userData)
        } else {
          setReceiver(null)
        }
        setLoading(false)
      })

      return () => {
        unsubscribe()
      }
    }
  }, [receiverId])

  const sendMessage = async (event: any) => {
    event.preventDefault()
    if (!receiverId) {
      return
    }
    if (!newMessage) {
      return
    }

    const chatRef = doc(db, 'chats', chatId)
    await addDoc(collection(chatRef, 'messages'), {
      content: newMessage,
      timestamp: serverTimestamp(),
      senderId: user?.userId,
      receiverId: receiverId,
      read: false,
    })
    if (receiverId !== user?.userId) {
      await addDoc(collection(db, 'mail'), {
        to: receiver?.email,
        message: {
          subject: 'New Message',
          html: `${user?.firstName} has sent you a message.`,
        },
      })
    }
    await updateDoc(chatRef, {
      lastMessage: newMessage,
      lastMessageTimestamp: serverTimestamp(),
    })
    setNewMessage('')
  }

  return (
    <div className="mx-auto  max-w-[800px] px-2">

      <div className="fixed left-0 right-0 top-0  z-10 bg-white px-2 py-3 duration-300 ease-in">
        <div className="mx-auto  max-w-[800px] ">
          <div
            onClick={() => router.back()}
            className="flex w-[70px] cursor-pointer flex-row items-center justify-start "
          >
            <MdArrowBack className="text-[20px] text-green-950" />
            <span className="ml-1 text-[18px] font-medium text-green-950">
              Back
            </span>
          </div>
        </div>
      </div>

      <div className=" mt-12">
        <h1 className="text-center text-sm font-medium text-gray-400">
          For your protection, keep communication and payments within QualityunitedWriters.
        </h1>
        <div className="mb-20 mt-5">
          {messages.map((message: any) => (
            <div key={message.messageId} className="my-3 w-full">
              <div
                className={`flex items-start ${message.senderId === user?.userId
                    ? 'flex-row-reverse'
                    : 'flex-row'
                  }`}
              >
                <div className="">
                  <Image
                    src={message.senderDetails.profilePicture}
                    alt="profile"
                    width={50}
                    height={50}
                    className="h-[45px] w-[45px] rounded-full object-cover"
                  />
                </div>
                <div
                  className={`min-h-[60px] flex-1 rounded-md p-2 ${message.senderId === user?.userId
                      ? 'ml-6 mr-2 bg-green-950 text-gray-100 md:ml-14'
                      : 'ml-2 mr-6 bg-gray-100 text-gray-800 md:mr-14'
                    }`}
                >
                  <div className="flex flex-row justify-between text-xs">
                    <span>{message.senderDetails.firstName}</span>

                    <span className="">
                      {new Date(
                        message.timestamp?.toMillis()
                      ).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}{' '}
                      {new Date(
                        message.timestamp?.toMillis()
                      ).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {message.fileUrl ? (
                    <div>
                      {message.senderId === user?.userId ? (
                        <span>
                          <p className="my-0.5 text-xs">File has been sent</p>
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-semibold"
                          >
                            View file
                          </a>
                        </span>
                      ) : (
                        <span className="flex flex-col">
                          <p className=" text-sm text-gray-800">
                            {message.senderDetails.firstName} shared a file
                          </p>
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-semibold"
                          >
                            View file
                          </a>
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-base ">{message.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white px-2 duration-300 ease-in">
        <form className="relative mx-auto mb-2 flex w-full max-w-[800px] flex-row items-center rounded-xl border-1border-gray-400 ">
          <input
            placeholder="Message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="mr-16 h-16 w-full rounded-xl  p-2 outline-none"
          />
          <div className="absolute right-0 mr-1 flex flex-row items-center space-x-3">
            <SendFile userId={user?.userId} chatId={chatId} />
            <MdSend
              size={28}
              className="cursor-pointer"
              onClick={sendMessage}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
