import React from "react";
import Image from "next/image";
import RadixAccordion from "@/components/accordion";

const reviewsContent = [
  {
    starRating: 5,
    review:
      "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
    userImage: "/images/reviews/user.svg", // Replace with actual path if different
    userName: "Arlene McCoy",
    userWorkplace: "McDonald's",
  },
  {
    starRating: 3,
    review:
      "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
    userImage: "/images/reviews/user.svg",
    userName: "Arlene McCoy",
    userWorkplace: "McDonald's",
  },
  {
    starRating: 2,
    review:
      "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
    userImage: "/images/reviews/user.svg",
    userName: "Arlene McCoy",
    userWorkplace: "McDonald's",
  },
  {
    starRating: 4,
    review:
      "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
    userImage: "/images/reviews/user.svg",
    userName: "Arlene McCoy",
    userWorkplace: "McDonald's",
  },
  {
    starRating: 5,
    review:
      "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
    userImage: "/images/reviews/user.svg",
    userName: "Arlene McCoy",
    userWorkplace: "McDonald's",
  },
  {
    starRating: 5,
    review:
      "One of the standout features of this gaming website is its extensive library of game guides and tutorials. It has helped me level up my skills, conquer challenging quests, and discover hidden secrets within games. The guides are comprehensive, easy to follow, and have undoubtedly elevated my gaming performance.",
    userImage: "/images/reviews/user.svg",
    userName: "Arlene McCoy",
    userWorkplace: "McDonald's",
  },
];

const Reviews = () => {
  return (
    <div className="pt-[100px] lg:pt-[150px]  pb-[100px] sm:pb-[120px] md:pb-[140px] lg:pb-[160px] flex flex-col items-center w-full gap-[67px]">
      <div className="text-center w-full ">
        <div className="section-title">
          <p>Frequestly Asked </p>
          <span className="gradient-text">Questions</span>
        </div>
      </div>

      <RadixAccordion />
    </div>
  );
};

export default Reviews;
