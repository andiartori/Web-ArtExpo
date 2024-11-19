import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Image from "next/image";
import { Quicksand } from "next/font/google";
import Link from "next/link";
import Head from "next/head";

const quicksand = Quicksand({ subsets: ["latin"] });

interface LoginUser {
	email: string;
	password: string;
}

const LoginUser: React.FC = () => {
	const router = useRouter();
	const [error, setError] = useState("");
	const [loginData, setLoginData] = useState<LoginUser>({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false); // State untuk loading

	function toHomeUser() {
		router.push({ pathname: "/homeuser" });
	}

	function toHomeAdmin() {
		router.push({ pathname: "/adminhome" });
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginData({ ...loginData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setIsLoading(true); // Set loading true sebelum melakukan request

		try {
			const response = await axios.post("/api/auth/login", {
				email: loginData.email,
				password: loginData.password,
			});

			Swal.fire({
				icon: "success",
				title: "Login Berhasil",
				text: response.data.message || "Selamat datang!",
			});

			const { access_token, refresh_token } = response.data.data;
			Cookies.set("access_token", access_token, { expires: 1 / 24 });
			Cookies.set("refresh_token", refresh_token, { expires: 7 });

			const role = response.data.data?.user?.role;

			if (role === "user") {
				toHomeUser();
			} else if (role === "admin") {
				toHomeAdmin();
			}

			setError("Something went wrong on loginuser index");
		} catch (error) {
			const err = error as Error;
			Swal.fire({
				icon: "error",
				title: "Login Failed. Check Your Credentials",
				text: err.message || "Email atau password salah.",
			});
		} finally {
			setIsLoading(false); // Set loading false setelah request selesai
		}
	};

	return (
		<div>
			<Head>
				<title>Art Expo</title>
			</Head>
			<section
				className={`bg-gradient-to-b from-gray-900 to-gray-600 text-white bg-black dark:bg-gray-900 ${quicksand.className}`}
			>
				<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
					<div className="flex items-center py-5">
						<Image src="/logo.png" alt="logo" width={240} height={150} />
					</div>
					<div className="w-full bg-yellow-500 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
								Sign in to your account
							</h1>
							<form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
								<div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Your email
									</label>
									<input
										type="email"
										name="email"
										className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="name@company.com"
										required
										value={loginData.email}
										onChange={handleChange}
									/>
								</div>
								<div>
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Password
									</label>
									<input
										type="password"
										name="password"
										placeholder="••••••••"
										className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
										value={loginData.password}
										onChange={handleChange}
									/>
								</div>
								<button
									type="submit"
									className="w-full text-white bg-primary-600 bg-black hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
									disabled={isLoading} // Disable button saat loading
								>
									{isLoading ? "Loading..." : "Sign in"}
								</button>

								{error && <p className="text-sm text-red-500 mt-2">{error}</p>}
								<p className="text-sm font-light text-black dark:text-white">
									Don&apos;t have an account yet?{" "}
									<Link href="/auth/register">
										<a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
											Register
										</a>
									</Link>
								</p>

								<p className="text-sm font-light text-black dark:text-white">
									Want to go back to home?{" "}
									<Link href="/">
										<a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
											Back To Home
										</a>
									</Link>
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
			</section>
		</div>
	);
};

export default LoginUser;
