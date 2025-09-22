"use client";
import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function SuccessPage() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataAndGenerateQR = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/problem/list`);
                const data = await response.json();
                
                if (data.data && data.data.length > 0) {
                    const firstId = data.data[0].id;
                    const chatUrl = `${process.env.NEXT_PUBLIC_API_BASE}/tasks/chat/user/${firstId}`;
                    const qrUrl = await QRCode.toDataURL(chatUrl);
                    setQrCodeUrl(qrUrl);
                }
            } catch (error) {
                console.error('Error generating QR code:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataAndGenerateQR();
    }, []);

    return (
        <div className="backdrop-opacity-10  bg-white/5
        w-full min-h-dvh max-w-4xl mx-auto rounded-2xl border  p-5 flex items-center justify-center opacity-100">
           <div className='grid grid-cols-2 gap-8 place-items-center'>
            <div className='text-center'>
                <h1 className='text-lg font-semibold'>แจ้งสำเร็จเรียบร้อยรอผลดำเนินการได้โดยการสแกน QR CODE</h1>
            </div>
             <div className='text-center'>
                <p className='text-xl font-bold'>QR CODE</p>
                {loading ? (
                    <p className='text-gray-500'>กำลังโหลด...</p>
                ) : qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto " />
                ) : (
                    <p className='text-gray-500'>ไม่สามารถสร้าง QR Code ได้</p>
                )}
            </div>
           </div>
        </div>
    )
}