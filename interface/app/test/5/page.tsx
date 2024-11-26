
"use client";

import { useState, useEffect } from 'react';
import { fetchLoadSolutions } from "@/lib/actions";
import GalleryPage from '@/comp/solution/GalleryPage';

const History = () => {
    const [id, setId] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            setId(storedId);
        }
    }, []);

    return (
        <div className='flex justify-center bg-neutral-900 text-white min-h-full'>
            <GalleryPage title="History" fetchData={fetchLoadSolutions} />
        </div>
    );
};

export default History;
