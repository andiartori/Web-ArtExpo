import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/router";

interface LoginAdmin {
	email: string;
	password: string;
}

const LoginForm: React.FC = () => {
	const router = useRouter();
	const [loginData, setLoginData] = useState<LoginAdmin>({
		email: "",
		password: "",
	});

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

			const role = response.data.data?.user?.role;
			if (role === "user") {
				toHomeUser();
			} else if (role === "admin") {
				toHomeAdmin();
			}
		} catch (error) {
			const err = error as Error;
			Swal.fire({
				icon: "error",
				title: "Login Gagal",
				text: err.message || "Email atau password salah.",
			});
		}
	};

	return (
		<div className="w-screen h-full justify-center items-center">
			<div className="login-form">
				<h2>Login Admin</h2>
				<form onSubmit={handleSubmit}>
					<div>
						<label>Email:</label>
						<input
							type="email"
							name="email"
							value={loginData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<label>Password:</label>
						<input
							type="password"
							name="password"
							value={loginData.password}
							onChange={handleChange}
							required
						/>
					</div>
					<button type="submit">Login</button>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
