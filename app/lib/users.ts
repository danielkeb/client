import axiosInstance from "../axiosInstance";

export async function fetchUser(username: string) {
  try {
    const res = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${username}`,
    );

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    return null;
  }
}
