/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const JobCard = ({
  job: {
    job_title,
    description,
    deadline,
    category,
    minPrice,
    maxPrice,
    bidCount,

    _id,
  },
}) => {
  return (
    <Link
      to={`/job/${_id}`}
      className="w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-light text-gray-800 ">
          Deadline: {deadline}
        </span>
        <span
          className={`px-3 py-1 text-[8px] text-blue-800 uppercase ${
            category === "Web Development" && "bg-blue-200"
          } ${category === "Graphics Design" && "bg-orange-200 text-black"}  ${
            category === "Digital Marketing" && "bg-green-200 text-black"
          } rounded-full`}
        >
          {category}
        </span>
      </div>

      <div>
        <h1 className="mt-2 text-lg font-semibold text-gray-800 ">
          {job_title}
        </h1>

        <p className="mt-2 text-sm text-gray-600 ">{description}</p>
        <p className="mt-2 text-sm font-bold text-gray-600 ">
          Range: ${minPrice} - ${maxPrice}
        </p>
        <p className="mt-2 text-sm font-bold text-gray-600 ">
          Total Bids: {bidCount || 0}
        </p>
      </div>
    </Link>
  );
};

export default JobCard;
