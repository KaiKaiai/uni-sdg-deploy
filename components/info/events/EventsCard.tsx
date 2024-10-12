import React from 'react';
import Image from 'next/image';


interface EventsCardProps {
    imgSrc: string;
    title: string;
    date: string;
    href?: string;
}

export const EventsCard: React.FC<EventsCardProps> = ({ imgSrc, title, date, href = "/" }) => (
    <div className="max-w-[336px] px-4 py-4 pb-6 rounded flex-col justify-start items-center gap-4 inline-flex bg-white 
                    hover:outline outline-1 outline-[#85B8FF] hover:drop-shadow-xl">
                <Image
                    src={imgSrc}
                    alt="Event Image"
                    width ={336/1.5}
                    height = {340/1.5}
                    />
            <div className="w-[336px] h-[82px] p-4 flex-col justify-start items-center gap-2 flex">
                <div className="self-stretch text-center text-black text-xl font-medium font-['Poppins'] leading-normal">{title}</div>
                <div className="self-stretch text-center text-black text-sm font-normal font-['Poppins'] leading-[18px]">{date}</div>
            </div>
            <button className="h-8 px-3 py-4 bg-[#CCE0FF] rounded-[3px] justify-center items-center inline-flex 
                text-black text-center text-sm font-normal font-['Poppins'] leading-tight 
                hover:bg-[#85B8FF] hover:text-white">
                {href && <a href={href}>Learn More</a>}
            </button>
    </div>
);

export default EventsCard;