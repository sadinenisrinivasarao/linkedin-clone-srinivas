import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {
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

	console.log("posts", posts);

	// Developer Details Styles
	const styles = {
		container: {
			position: "fixed",
			width: "300px",
			height: "100%",
			backgroundColor: "#f9f9f9",
			boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
			padding: "20px",
			boxSizing: "border-box",
			zIndex: 1000,
			fontFamily: "Arial, sans-serif",
		},
		strong: {
			fontSize: "18px",
		},
		header: {
			marginBottom: "15px",
			color: "#333",
			textAlign: "center",
			fontSize: "25px",
			fontWeight: "700",
		},
		image: {
			height: "30%",
			borderRadius: "50%",
			margin: "0 auto",
			display: "block",
			boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
		},
		paragraph: {
			margin: "10px 0",
			color: "#555",
			textAlign: "left",
			fontSize: "18px",
		},
		links: {
			display: "flex",
			gap: "20%",
			marginTop: "15px",
		},
		iconLink: {
			textDecoration: "none",
		},
		icon: {
			width: "30px",
			height: "30px",
		},
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
			<div className="hidden lg:block lg:col-span-1">
				<Sidebar user={authUser} />
			</div>

			<div className="col-span-1 lg:col-span-2 order-first lg:order-none">
				<PostCreation user={authUser} />

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

			<div className='col-span-1 lg:col-span-1 hidden lg:block'>
				{/* Show Recommended Users */}
				{recommendedUsers?.length > 0 && (
					<div className='bg-secondary rounded-lg shadow p-4'>
						<h2 className='font-semibold mb-4'>People you may know</h2>
						{recommendedUsers?.map((user) => (
							<RecommendedUser key={user._id} user={user} />
						))}
					</div>
				)}

				{/* Show Developer Details if No Recommended Users */}
				{recommendedUsers?.length === 0 && (
					<div
						style={{
							position: "fixed",
							width: "300px",
							height: "100%",
							backgroundColor: "#f9f9f9",
							boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
							padding: "20px",
							boxSizing: "border-box",
							zIndex: 1000,
							fontFamily: "Arial, sans-serif",
						}}
					>
						<h2
							style={{
								marginBottom: "15px",
								color: "#333",
								textAlign: "center",
								fontSize: "25px",
								fontWeight: "700",
							}}
						>
							Developer Details
						</h2>
						<img
							src='/my-image.jpg'
							alt='Srinivas Sadineni'
							loading="lazy"
							style={{
								height: "30%",
								borderRadius: "50%",
								margin: "0 auto",
								display: "block",
								boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
							}}
						/>
						<div>
							<p
								style={{
									margin: "10px 0",
									color: "#555",
									textAlign: "left",
									fontSize: "18px",
								}}
							>
								<strong style={{ fontSize: "18px" }}>Name:</strong> Srinivas
								Sadineni
							</p>
							<p
								style={{
									margin: "10px 0",
									color: "#555",
									textAlign: "left",
									fontSize: "18px",
								}}
							>
								<strong style={{ fontSize: "18px" }}>Role:</strong> FullStack
								Developer
							</p>
							<p
								style={{
									margin: "10px 0",
									color: "#555",
									textAlign: "left",
									fontSize: "18px",
								}}
							>
								<strong style={{ fontSize: "18px" }}>Experience:</strong> 4+
								years
							</p>
						</div>
						<div
							style={{
								display: "flex",
								gap: "20%",
								marginTop: "15px",
							}}
						>
							<a
								href='https://www.linkedin.com/in/srisadineni6/'
								target='_blank'
								rel='noopener noreferrer'
								style={{ textDecoration: "none" }}
							>
								<img
									src='/sidebar-linkedin-logo.png'
									alt='LinkedIn'
									style={{ height: "40px" }}
									loading="lazy"
								/>
							</a>
							<a
								href='https://srinivassadineni-portfolio.com'
								target='_blank'
								rel='noopener noreferrer'
								style={{ textDecoration: "none" }}
							>
								<img
									src='/sidebar-portfolio-logo.png'
									alt='Portfolio'
									style={{ height: "40px" }}
									loading="lazy"
								/>
							</a>
							<a
								href='mailto:srinivasaraofullstackdev@gmail.com'
								style={{ textDecoration: "none" }}
							>
								<img
									src='/sidebar-email-logo.png'
									alt='Email'
									style={{ height: "40px" }}
									loading="lazy"
								/>
							</a>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
