import React, { useState, useEffect } from 'react';
import './MiniCard.css';
import { GetColor } from '@/lib/hooks/color';
import useRouterHook from '@/lib/hooks/router-hook';
import Link from 'next/link';
import { fetchLikeSolution } from '@/lib/actions';
import { FaHeart } from 'react-icons/fa';

const MiniCard = React.memo(function MiniCard(props: { content: any, index: number, isLiked: boolean }) {
    const { routes } = useRouterHook();
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setIsLiked(props.isLiked);
    }, [props.isLiked]);

    const handleLiked = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsLiked(!isLiked);

        const result = await fetchLikeSolution(props.content.id);
        console.log(result);

        // routes.refreshPage();
    };

    return (
        <div>
            <Link
                href={`/solution/${props.content.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                    backgroundColor: GetColor(props.index, 50),
                }}
            >
                <img src={props.content.solution?.image_url} alt="Card Image" />

                <button
                    className="favorite-button"
                    style={{
                        color: isLiked ? '#ff6961' : '#BBBBBB',
                    }}
                    onClick={handleLiked}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <FaHeart />
                </button>

                <div className="content">
                    <h2 className="function">
                        {props.content.solution?.Title}
                    </h2>
                </div>
            </Link>
        </div>
    );
});

export default MiniCard;
MiniCard.whyDidYouRender = true;
