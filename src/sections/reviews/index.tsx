import React from "react";
import Image from "next/image";

const reviewsContent = [
    {
      starRating: 5,
      review: "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
      userImage: "/images/reviews/user.svg", // Replace with actual path if different
      userName: "Arlene McCoy",
      userWorkplace: "McDonald's"
    },
    {
      starRating: 3,
      review: "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
      userImage: "/images/reviews/user.svg",
      userName: "Arlene McCoy",
      userWorkplace: "McDonald's"
    },
    {
      starRating: 2,
      review: "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
      userImage: "/images/reviews/user.svg",
      userName: "Arlene McCoy",
      userWorkplace: "McDonald's"
    },
    {
      starRating: 4,
      review: "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
      userImage: "/images/reviews/user.svg",
      userName: "Arlene McCoy",
      userWorkplace: "McDonald's"
    },
    {
      starRating: 5,
      review: "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
      userImage: "/images/reviews/user.svg",
      userName: "Arlene McCoy",
      userWorkplace: "McDonald's"
    },
    {
      starRating: 5,
      review: "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
      userImage: "/images/reviews/user.svg",
      userName: "Arlene McCoy",
      userWorkplace: "McDonald's"
    }
  ];

const Reviews = () => {
  return (
    <div className="py-12 flex flex-col items-center w-full gap-[67px]">
      <div className="text-center w-full ">
        <p className="section-title">
          <span>Why </span>
          <span className="gradient-text">Choose</span>
          <span> Us?</span>
        </p>
      </div>

      <div className="flex flex-wrap px-[10px] lg:px-[20px] justify-center  items-center gap-[17px] ">
        {reviewsContent.map((item, index) => (
          <div  className="max-w-[433px] flex flex-col border-[1px] border-white/20 rounded-lg px-[18px] pt-[33px] pb-[25px] backdrop-blur-[50px] shadow-[0_4px_20px_-1px_rgba(0,0,0,0)] bg-white/5 text-center  justify-between">
            <div className="flex flex-col gap-[14px] px-[7px] text-justify pb-[20px] border-b-[1px] border-white/70 mb-[20px]">
              <p className="text-[11px] font-normal leading-[2] tracking-wide">
                {item.review}
              </p>
            </div>
            <div className="flex justify-start gap-[8px]  ">
              <Image
                src={item.userImage}
                alt="service1"
                width={44}
                height={44}
                className="drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)] rounded-full"
              />
              <p className="text-[11px] font-[500] leading-[1.3] tracking-wider text-left ">
                {item.userName} <br />
                {item.userWorkplace}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
