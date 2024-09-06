import axios from "axios";

export async function fetchStats() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/stats/summary`,
    );

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    return null;
  }
}
