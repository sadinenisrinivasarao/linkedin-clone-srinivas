import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users, Search } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  // Filter recommended users based on search input
  const filteredRecommendedUsers =
    searchTerm.trim() === ""
      ? recommendedUsers?.slice(0, 5) || []
      : recommendedUsers?.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />

        {/* Render posts */}
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">No Posts Yet</h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>

      <div className="col-span-1 lg:col-span-1 hidden lg:block">
        {/* Search box */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <Search className="mr-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search for more connections"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Recommended Users Section */}
        {filteredRecommendedUsers.length > 0 ? (
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {filteredRecommendedUsers.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Users size={64} className="mx-auto text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">User Not Found</h2>
            <p className="text-gray-600">Try searching for someone else.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
