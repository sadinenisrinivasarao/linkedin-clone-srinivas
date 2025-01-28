import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";


const SignUpPage = () => {
	return (
		<div className='min-h-screen flex flex-col sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				
				<h2 className='text-center text-3xl font-extrabold text-gray-900'>
					Make the most of your professional life
				</h2>
				<h4 className="text-center">This website developed by Srinivas Sadineni</h4>
			</div>
			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<SignUpForm />

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-700'>Already on LinkedIn?</span>
							</div>
						</div>
						<div className='mt-6'>
							<Link
								to='/login'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm  login_signup_btn bg-white hover:bg-gray-50'
							>
								Log in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
