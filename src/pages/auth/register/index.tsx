import React, { useState, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Image from "next/image";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"] });

interface Register {
	username: string;
	email: string;
	password: string;
	referral_code?: string;
}

interface ErrorResponse {
	message: string;
}

function Register() {
	const [credentials, setCredentials] = useState<Register>({
		username: "",
		email: "",
		password: "",
		referral_code: "",
	});

	const [isLoading, setIsLoading] = useState(false); // State for loading

	// Input change event type
	type InputChangeEvent = ChangeEvent<HTMLInputElement>;

	// Form submit event type
	type FormSubmitEvent = FormEvent<HTMLFormElement>;

	async function submitRegister(e: FormSubmitEvent) {
		e.preventDefault();
		setIsLoading(true); // Set loading to true during submission

		try {
			const response = await axios.post("/api/users", credentials);

			if (response.status === 201) {
				Swal.fire({
					title: "Register success",
					text: "You will be redirected to the login page.",
					icon: "success",
					confirmButtonText: "OK",
				}).then((result) => {
					if (result.isConfirmed) {
						window.location.href = "/auth/loginuser";
					}
				});
			}
		} catch (error) {
			let errorMessage = "Failed to register";

			if (axios.isAxiosError(error) && error.response) {
				const data = error.response.data as ErrorResponse;
				errorMessage = data.message || errorMessage;
			}

			Swal.fire({
				title: errorMessage,
				icon: "error",
				confirmButtonText: "OK",
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.href = "/auth/register";
				}
			});
		} finally {
			setIsLoading(false); // Set loading to false after completion
		}
	}

	const handleChange = (e: InputChangeEvent) => {
		const { id, value } = e.target;

		setCredentials((prev) => ({
			...prev,
			[id]: value, // Dynamically update the field based on `id`
		}));
	};

	return (
		<div
			className={`bg-gradient-to-b from-gray-900 to-gray-600 text-white bg-black dark:bg-gray-900 ${quicksand.className}`}
		>
			<div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
				<div className="flex items-start">
					<Image src="/logo.png" alt="logo" width={200} height={120} />
				</div>
				<div className="w-full bg-yellow-500 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-3 md:space-y-6 sm:p-8">
						{/* Form */}
						<form onSubmit={submitRegister}>
							<div className="mb-2">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Your e-mail
								</label>
								<input
									type="email"
									id="email"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="youremail@example.com"
									onChange={handleChange}
									required
								/>
							</div>

							<div className="mb-5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Your password
								</label>
								<input
									type="password"
									id="password"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									onChange={handleChange}
									required
									minLength={6}
								/>
							</div>

							<div className="mb-5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Your username
								</label>
								<input
									type="text"
									id="username"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									onChange={handleChange}
									required
								/>
							</div>

							<div className="mb-5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Use Referral Code
								</label>
								<input
									type="text"
									id="referral_code"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									onChange={handleChange}
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								className="w-full text-white bg-primary-600 bg-black hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
								disabled={isLoading}
							>
								{isLoading ? "Loading..." : "Submit"}
							</button>

							<p className="text-sm text-bold text-black dark:text-white py-2">
								Have an account?{" "}
								<a
									href="/auth/loginuser"
									className="font-medium text-primary-600 hover:underline dark:text-primary-500"
								>
									Sign in
								</a>
							</p>
							<p className="text-sm font-light text-black dark:text-white">
								Want to go back to home?{" "}
								<a
									href="/"
									className="font-medium text-primary-600 hover:underline dark:text-primary-500"
								>
									Back To Home
								</a>
							</p>
						</form>
					</div>
				</div>
			</div>

			{/* Loading Spinner */}
			{isLoading && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="spinner-border text-white animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
				</div>
			)}
		</div>
	);
}

export default Register;

//backup original :
// import React, { useState } from "react";
// import Swal from "sweetalert2";
// import axios from "axios";
// import Image from "next/image";
// import { Quicksand } from "next/font/google";

// const quicksand = Quicksand({ subsets: ["latin"] });

// interface Register {
//   username: string;
//   email: string;
//   password: string;
//   referral_code?: string;
// }

// interface ErrorResponse {
//   message: string;
// }

// function Register() {
//   const [credentials, setCredentials] = useState<Register>({
//     username: "",
//     email: "",
//     password: "",
//     referral_code: "",
//   });
//   const [isLoading, setIsLoading] = useState(false); // State untuk loading

//   async function submitRegister(e: any) {
//     e.preventDefault();
//     setIsLoading(true); // Set loading menjadi true saat form disubmit
//     try {
//       const response = await axios.post("/api/users", {
//         username: credentials.username,
//         email: credentials.email,
//         password: credentials.password,
//         referral_code: credentials.referral_code,
//       });

//       if (response.status === 201) {
//         Swal.fire({
//           title: "Register success",
//           text: "You will be prompted back to home.",
//           icon: "success",
//           confirmButtonText: "OK",
//         }).then((result) => {
//           if (result.isConfirmed) {
//             window.location.href = "/auth/loginuser";
//           }
//         });
//       }
//     } catch (error) {
//       let errorMessage = "Failed to register";

//       if (axios.isAxiosError(error) && error.response) {
//         const data = error.response.data as ErrorResponse;
//         errorMessage = data.message || errorMessage;
//       }

//       Swal.fire({
//         title: errorMessage,
//         icon: "error",
//         confirmButtonText: "OK",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           window.location.href = "/auth/register";
//         }
//       });
//     } finally {
//       setIsLoading(false); // Set loading menjadi false setelah proses selesai
//     }
//   }

//   return (
//     <div
//       className={bg-gradient-to-b from-gray-900 to-gray-600 text-white bg-black dark:bg-gray-900 ${quicksand.className}}
//     >
//       <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
//         <div className="flex items-start">
//           <Image src="/logo.png" alt="logo" width={200} height={120} />
//         </div>
//         <div className="w-full bg-yellow-500 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//           <div className="p-6 space-y-3 md:space-y-6 sm:p-8">
//             {/* Form */}
//             <form onSubmit={submitRegister}>
//               <div className="mb-2">
//                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                   Your e-mail
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   placeholder="youremail@example.com"
//                   onChange={(e: any) =>
//                     setCredentials({
//                       username: credentials.username,
//                       email: e.target.value,
//                       password: credentials.password,
//                       referral_code: credentials.referral_code,
//                     })
//                   }
//                   required
//                 />
//               </div>

//               <div className="mb-5">
//                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                   Your password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   onChange={(e: any) =>
//                     setCredentials({
//                       username: credentials.username,
//                       email: credentials.email,
//                       password: e.target.value,
//                       referral_code: credentials.referral_code,
//                     })
//                   }
//                   required
//                   minLength={6}
//                 />
//               </div>

//               <div className="mb-5">
//                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                   Your username
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   onChange={(e: any) =>
//                     setCredentials({
//                       username: e.target.value,
//                       email: credentials.email,
//                       password: credentials.password,
//                       referral_code: credentials.referral_code,
//                     })
//                   }
//                   required
//                 />
//               </div>

//               <div className="mb-5">
//                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                   USE REFERRAL CODE
//                 </label>
//                 <input
//                   type="text"
//                   id="referralCode"
//                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   onChange={(e: any) =>
//                     setCredentials({
//                       username: credentials.username,
//                       email: credentials.email,
//                       password: credentials.password,
//                       referral_code: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full text-white bg-primary-600 bg-black hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//                 disabled={isLoading} // Disable button saat loading
//               >
//                 {isLoading ? "Loading..." : "Submit"} {/* Tampilkan "Loading..." jika isLoading true */}
//               </button>

//               <p className="text-sm text-bold text-black dark:text-white py-2">
//                 Have an account?{" "}
//                 <a
//                   href="/auth/loginuser"
//                   className="font-medium text-primary-600 hover:underline dark:text-primary-500"
//                 >
//                   Sign in
//                 </a>
//               </p>
//               <p className="text-sm font-light text-black dark:text-white">
//                 Want to go back to home?{" "}
//                 <a
//                   href="/"
//                   className="font-medium text-primary-600 hover:underline dark:text-primary-500"
//                 >
//                   Back To Home
//                 </a>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Loading Spinner */}
//       {isLoading && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="spinner-border text-white animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Register;
