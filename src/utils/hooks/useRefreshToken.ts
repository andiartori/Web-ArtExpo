import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export const useRefreshToken = async () => {
	try {
		const refreshToken = Cookies.get("refresh_token");

		if (!refreshToken) {
			throw new Error("Refresh token is missing.");
		}

		const response = await axios.post(
			"http://localhost:8000/api/auth/refresh-token",
			{
				refreshToken,
			}
		);

		if (response.status === 200 && response.data.data?.refresh_token) {
			const newAccessToken = response.data.data.refresh_token; // Ensure this matches your API response structure

			Cookies.set("access_token", newAccessToken, { expires: 1 / 1440 }); // 1 minute = 1/1440 days
			return newAccessToken;
		} else {
			throw new Error("Failed to retrieve new access token");
		}
	} catch (error) {
		const err = error as Error;
		Swal.fire("Error!", "Session expired. Please log in again." + err.message).then(
			() => {
				window.location.href = "/auth/loginuser";
			}
		);
		return null;
	}
};
