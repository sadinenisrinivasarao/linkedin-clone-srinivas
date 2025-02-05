import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserPlus, Search } from "lucide-react";
import FriendRequest from "../components/FriendRequest";
import UserCard from "../components/UserCard";
import RecommendedUser from "../components/RecommendedUser";

const NetworkPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: user } = useQuery({ queryKey: ["authUser"] });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests"),
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });

  // Filter users based on search query
  const filteredUsers =
    searchTerm.trim() === ""
      ? recommendedUsers?.slice(0, 5) || []
      : recommendedUsers?.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

  const filteredConnections =
    connections?.data?.filter((conn) =>
      conn.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={user} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">My Network</h1>

          

          {connectionRequests?.data?.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Connection Request</h2>
              <div className="space-y-4">
                {connectionRequests.data.map((request) => (
                  <FriendRequest key={request.id} request={request} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
              <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Connection Requests
              </h3>
              <p className="text-gray-600">
                You don&apos;t have any pending connection requests at the
                moment.
              </p>
              <p className="text-gray-600 mt-2">
                Explore suggested connections below to expand your network!
              </p>
            </div>
          )}

          {filteredConnections.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">My Connections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredConnections.map((connection) => (
                  <UserCard
                    key={connection._id}
                    user={connection}
                    isConnection={true}
                  />
                ))}
              </div>
            </div>
          )}

<div className="flex items-center mb-6">
            <Search className="mr-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search for more connections"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">
              {searchTerm.trim() === "" ? "People you may know" : "Search Results"}
            </h2>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))
            ) : (
              <p className="text-gray-600">User not found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
