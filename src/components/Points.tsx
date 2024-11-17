import React from "react";
import { FaUserPlus, FaCode, FaClock, FaUserCheck, FaTag, FaUndo, FaGift } from "react-icons/fa";

const Points = () => {
  return (
    <section className="bg-white py-8 px-4 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-black mb-6">
          How Referral Tokens and Points Work
        </h2>
        <div className="text-left space-y-6">
          {/* Registering as a User Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-black mb-4 flex items-center">
              <FaUserPlus className="text-blue-600 mr-2" />
              Registering as a User
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700">
                <FaUserCheck className="text-green-500 mr-3" />
                Users can register using their email, password, and simple input credentials.
              </li>
              <li className="flex items-center text-gray-700">
                <FaCode className="text-purple-500 mr-3" />
                The referral-codes feature allows users to earn points by encouraging others to register using their code.
              </li>
              <li className="flex items-center text-gray-700">
                <FaClock className="text-yellow-500 mr-3" />
                Referral codes have no expiry date—users can continue inviting others indefinitely.
              </li>
              <li className="flex items-center text-gray-700">
                <FaUserCheck className="text-blue-500 mr-3" />
                Only users with the user role can register.
              </li>
            </ul>
          </div>

          {/* How Points Work Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-black mb-4 flex items-center">
              <FaGift className="text-red-600 mr-2" />
              How Points Work
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700">
                <FaTag className="text-green-500 mr-3" />
                All points accumulated by the user will be converted into discounts: 1 point = Rp. 1,000.
              </li>
              <li className="flex items-center text-gray-700">
                <FaGift className="text-orange-500 mr-3" />
                If the discount amount exceeds the event price, the user can join the event for free. Any remaining points will not be used.
              </li>
              <li className="flex items-center text-gray-700">
                <FaUndo className="text-blue-500 mr-3" />
                If a booking is canceled, the points used will be refunded to the user.
              </li>
            </ul>
          </div>
        </div>
      </div>
      
    </section>

    
  );
};

export default Points;
