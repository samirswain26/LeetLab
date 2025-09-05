import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const delteProblem = async () => {
  try {
    const res = await axiosInstance.delete("/problems/delete-problem");
    console.log("Delete Problem is :", res.data);
    toast.success("Problem Deleted Succesfully");
  } catch (error) {
    console.log("Error in Deleting Problem : ", error);
    toast.error("Error in Deleting Problem");
  }
};
