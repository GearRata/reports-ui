import React from 'react'


export default function SuccessPage() {
    return (
        // bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%
        // bg-linear-to-b/oklch from-gray-500 to-gray-800 
        <div className="backdrop-opacity-10  bg-white/5
        w-full min-h-dvh max-w-4xl mx-auto rounded-2xl border  p-5 flex items-center justify-center opacity-100">
           <div className='grid grid-cols-2 gap-8 place-items-center'>
            <div className='text-center'>
                <h1 className='text-lg font-semibold'>แจ้งสำเร็จเรียบร้อยรอผลดำเนินการได้โดยการสแกน QR CODE</h1>
            </div>
             <div className='text-center'>
                <p className='text-xl font-bold'>QR CODE</p>
                <p className='text-gray-500'>lorem200</p>
            </div>
           </div>
                
            
                      
                   
           
        </div>
    )
}