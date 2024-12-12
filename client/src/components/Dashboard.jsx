import React from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  faBookOpen,
  faFileAlt,
  faUserSecret,
  faUsers,
  faUserCheck,
  faGavel,
  faHistory,
  faCalendarCheck,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "./Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      icon: faBookOpen,
      iconColor: "text-blue-600",
      title: "General Diary",
      description:
        "Records of daily events and activities in the police station.",
    },
    {
      icon: faFileAlt,
      iconColor: "text-green-600",
      title: "FIR",
      description: "First Information Reports of incidents and crimes.",
    },
    {
      icon: faUserSecret,
      iconColor: "text-red-600",
      title: "Suspects",
      description: "Details of individuals suspected in criminal activities.",
    },
    {
      icon: faUsers,
      iconColor: "text-yellow-600",
      title: "Victims",
      description: "Information about crime victims and their details.",
    },
    {
      icon: faUserCheck,
      iconColor: "text-teal-600",
      title: "Witnesses",
      description: "Details of individuals who witnessed a crime or incident.",
    },
    {
      icon: faGavel,
      iconColor: "text-orange-600",
      title: "Evidence",
      description: "Collection of physical and digital evidence for cases.",
    },
    {
      icon: faHistory,
      iconColor: "text-purple-600",
      title: "Crime History",
      description: "A record of past criminal cases and their outcomes.",
    },
    {
      icon: faGavel,
      iconColor: "text-red-500",
      title: "Conviction",
      description:
        "Details of convictions and sentences handed down by the courts.",
    },
    {
      icon: faCalendarCheck,
      iconColor: "text-green-500",
      title: "Duty Rosters",
      description:
        "Schedule of duties for police officers and other personnel.",
    },
    {
      icon: faHandHoldingUsd,
      iconColor: "text-blue-500",
      title: "Bail Records",
      description:
        "Records of bail granted to individuals involved in criminal cases.",
    },
  ];

  const handleCardClick = (title) => {
    navigate("/search", { state: { heading: title } });
  };

  return (
    <div>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold text-blue-800">Dashboard</h1>
          <p className="text-gray-600">
            Manage all police records and data from here.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl cursor-pointer"
              onClick={() => handleCardClick(card.title)}
            >
              <div className="flex items-center justify-between mb-4">
                <FontAwesomeIcon
                  icon={card.icon}
                  className={`text-4xl ${card.iconColor}`}
                />
                <h3 className="text-2xl font-semibold text-blue-800">
                  {card.title}
                </h3>
              </div>
              <p className="text-gray-500 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;