import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { compareAsc } from "date-fns";

const JobDetails = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { id } = useParams();
  const [job, setJob] = useState({});
  const { user } = useAuth();
  const instance = useAxiosSecure();

  useEffect(() => {
    (async function () {
      const { data } = await instance.get(`/jobs/${id}`);
      setJob(data);
    })();
  }, [id, instance]);

  const {
    _id,
    email,
    job_title,
    description,
    deadline,
    category,
    minPrice,
    maxPrice,
  } = job;

  const bidHandler = (e) => {
    e.preventDefault();
    const form = e.target;
    const bidPrice = form.price.value;
    const sellerEmail = user.email;
    const jobTitle = job_title;
    const buyerEmail = email;
    const deadline = startDate;
    const comment = form.comment.value;

    // 1. if the job deadline is less-than of current date don't allow user to place bid
    //  Note: __date-fns__ Compare the two dates and return 1 if the first date is after the second, -1 if the first date is before the second or 0 if dates are equal.
    // console.log(compareAsc(new Date(), new Date(job.deadline))); // 1
    if (compareAsc(new Date(), new Date(job.deadline)) === 1) {
      return console.log("The Deadline is crosed!");
    }

    // 2. if the seller bid deadline is greater-than job deadline return them
    if (compareAsc(new Date(deadline), new Date(job.deadline)) === 1) {
      return console.log("opps, you deadline is not capable!");
    }
    // 3. if buyer amount range and seller amount range greater or less return them
    if (
      parseInt(bidPrice) < parseInt(minPrice) ||
      parseInt(bidPrice) > parseInt(maxPrice)
    ) {
      return console.log("Your price range problem please fix it!");
    }

    // fynaly send the request to the server
    const bidData = {
      jobId: _id,
      jobTitle,
      bidPrice,
      deadline,
      category,
      comment,
      sellerEmail,
      buyerEmail,
      status: "Pending",
    };

    console.log(bidData);

    (async function () {
      try {
        const res = await instance.post("/bids", bidData);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  return (
    <div className="flex flex-col md:flex-row justify-around gap-5  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto ">
      {/* Job Details */}
      <div className="flex-1  px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-gray-800 ">
            Deadline: {deadline}
          </span>
          <span className="px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full ">
            {category}
          </span>
        </div>

        <div>
          <h1 className="mt-2 text-3xl font-semibold text-gray-800 ">
            {job_title}
          </h1>

          <p className="mt-2 text-lg text-gray-600 ">{description}</p>
          <p className="mt-6 text-sm font-bold text-gray-600 ">
            Buyer Details:
          </p>
          <div className="flex items-center gap-5">
            <div>
              <p className="mt-2 text-sm  text-gray-600 ">
                Email: {email || "john@gamil.com"}
              </p>
            </div>
          </div>
          <p className="mt-6 text-lg font-bold text-gray-600 ">
            Range: ${minPrice} - ${maxPrice}
          </p>
        </div>
      </div>
      {/* Place A Bid Form */}
      <section className="p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]">
        <h2 className="text-lg font-semibold text-gray-700 capitalize ">
          Place A Bid
        </h2>

        <form onSubmit={bidHandler}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700 " htmlFor="price">
                Price
              </label>
              <input
                id="price"
                type="text"
                name="price"
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-gray-700 " htmlFor="emailAddress">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                name="email"
                defaultValue={user?.email}
                disabled
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-gray-700 " htmlFor="comment">
                Comment
              </label>
              <input
                id="comment"
                name="comment"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="text-gray-700">Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className="border p-2 rounded-md"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              disabled={user.email === job.email}
              type="submit"
              className={`px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform  rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 ${
                user.email === job.email ? "bg-gray-400" : "bg-gray-700"
              }`}
            >
              Place Bid
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default JobDetails;
