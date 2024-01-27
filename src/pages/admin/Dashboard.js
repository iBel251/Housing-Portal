import React from "react";
import {
  BsFillChatDotsFill,
  BsFillHousesFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import { AiFillWechat } from "react-icons/ai";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { UserAuth } from "../../context/AuthContext";
import { ChatAuth } from "../../context/ChatContext";
import { HouseAuth } from "../../context/HouseContext";
import { useEffect, useState } from "react";

function Dashboard() {
  const { countUsers } = UserAuth();
  const { countChats } = ChatAuth();
  const { countHouses } = HouseAuth();
  const [dataCount, setDataCount] = useState({
    users: 0,
    houses: 0,
    chats: 0,
  });
  useEffect(() => {
    // Count users
    countUsers()
      .then((count) => {
        setDataCount((prevDataCount) => ({
          ...prevDataCount,
          users: count,
        }));
      })
      .catch((error) => {
        console.error("Could not count users:", error);
      });

    // Count houses
    countHouses()
      .then((count) => {
        setDataCount((prevDataCount) => ({
          ...prevDataCount,
          houses: count,
        }));
      })
      .catch((error) => {
        console.error("Could not count houses:", error);
      });

    // Count chats
    countChats()
      .then((count) => {
        setDataCount((prevDataCount) => ({
          ...prevDataCount,
          chats: count,
        }));
      })
      .catch((error) => {
        console.error("Could not count chat rooms:", error);
      });
  }, []);
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>USERS</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{dataCount.users}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>HOUSES</h3>
            <BsFillHousesFill className="card_icon" />
          </div>
          <h1>{dataCount.houses}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>CHAT ROOMS</h3>
            <BsFillChatDotsFill className="card_icon" />{" "}
          </div>
          <h1>{dataCount.chats}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>REPORTS</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: "white" }} />
            <YAxis tick={{ fill: "white" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: "white" }} />
            <YAxis tick={{ fill: "white" }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Dashboard;
