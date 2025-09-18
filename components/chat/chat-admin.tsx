// 'use client';

// import { useState } from 'react';

// import {
//   PromptInput,
//   type PromptInputMessage,
//   PromptInputSubmit,
//   PromptInputTextarea,
// } from '@/components/ui/ai-elements/prompt-input';
// import { Message, MessageContent } from '@/components/ui/ai-elements/message';
// import {
//   Conversation,
//   ConversationContent,
// } from '@/components/ui/ai-elements/conversation';
// import { Loader } from '@/components/ui/ai-elements/loader';
// // import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

// interface Chat {
//   id: string;
//   demo: string;
// }

// export default function ChatAdmin() {
//   const [message, setMessage] = useState('');
//   const [currentChat, setCurrentChat] = useState<Chat | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [chatHistory, setChatHistory] = useState<
//     Array<{
//       type: 'user' | 'assistant';
//       content: string;
//     }>
//   >([]);

//   const handleSendMessage = async (promptMessage: PromptInputMessage) => {
//     const hasText = Boolean(promptMessage.text);
//     const hasAttachments = Boolean(promptMessage.files?.length);
    
//     if (!(hasText || hasAttachments) || isLoading) return;

//     const userMessage = promptMessage.text?.trim() || 'Sent with attachments';
//     setMessage('');
//     setIsLoading(true);

//     setChatHistory((prev) => [...prev, { type: 'user', content: userMessage }]);

//     // try {
//     //   const response = await fetch('/api/chat', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({
//     //       message: userMessage,
//     //       chatId: currentChat?.id,
//     //     }),
//     //   });

//     //   if (!response.ok) {
//     //     throw new Error('Failed to create chat');
//     //   }

//     //   const chat: Chat = await response.json();
//     //   setCurrentChat(chat);

//     //   setChatHistory((prev) => [
//     //     ...prev,
//     //     {
//     //       type: 'assistant',
//     //       content: 'Generated new app preview. Check the preview panel!',
//     //     },
//     //   ]);
//     // } catch (error) {
//     //   console.error('Error:', error);
//     //   setChatHistory((prev) => [
//     //     ...prev,
//     //     {
//     //       type: 'assistant',
//     //       content:
//     //         'Sorry, there was an error creating your app. Please try again.',
//     //     },
//     //   ]);
//     // } finally {
//     //   setIsLoading(false);
//     // }
//   };

//   return (
//     <div className="h-screen flex">
//       {/* Chat Panel */}
//       <div className="w-full flex flex-col border-r">
//         {/* Header */}
//         <div className="border-b p-3 h-14 flex items-center justify-between">
//           <h1 className="text-lg font-semibold">Task</h1>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {chatHistory.length === 0 ? (
//             <div className="text-center font-semibold mt-8">
//               <p className="text-3xl mt-4">What can we build together?</p>
//             </div>
//           ) : (
//             <>
//               <Conversation>
//                 <ConversationContent>
//                   {chatHistory.map((msg, index) => (
//                     <Message from={msg.type} key={index}>
//                       <MessageContent>{msg.content}</MessageContent>
//                     </Message>
//                   ))}
//                 </ConversationContent>
//               </Conversation>
//               {/* {isLoading && (
//                 <Message from="assistant">
//                   <MessageContent>
//                     <div className="flex items-center gap-2">
//                       <Loader />
//                       Creating your app...
//                     </div>
//                   </MessageContent>
//                 </Message>
//               )} */}
//             </>
//           )}
//         </div>

//         {/* Input */}
//         <div className="border-t p-4">
//           <div className="flex">
//             <PromptInput
//               onSubmit={handleSendMessage}
//               className="w-full  mx-auto relative rounded-full "
//             >
//               <PromptInputTextarea
//                 onChange={(e) => setMessage(e.target.value)}
//                 value={message}
//                 className="pr-12 min-h-[60px]"
//               />
//               <PromptInputSubmit
//                 className="absolute bottom-3 rounded-full right-3"
//                 disabled={!message}
//                 status={isLoading ? 'streaming' : 'ready'}
//               />
//             </PromptInput>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }