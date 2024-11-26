"use client";

import { useState, useEffect } from 'react';
import { fetchGallery } from '@/lib/actions';
import GalleryPage from '@/comp/solution/GalleryPage';

const Gallery = () => {
    const [id, setId] = useState('');

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            setId(storedId);
        }
    }, []);

    return (
        <div className='flex justify-center bg-neutral-900 text-white min-h-full'>
            <GalleryPage title="Gallery" fetchData={fetchGallery} />
        </div>
    );
};

export default Gallery;
