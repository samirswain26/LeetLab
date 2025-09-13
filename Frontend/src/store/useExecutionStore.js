import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
    isExecuting : false,
    submission:null,


    executeCode: async(source_code, language_id, stdin, expected_outputs, problemId)=>{
        try {
            set({isExecuting: true})
            console.log("Submission :", JSON.stringify({
                source_code, language_id, stdin, expected_outputs, problemId
            }))

            const res = await axiosInstance.post("/execute-code", {
                source_code, language_id, stdin, expected_outputs, problemId
            })

            console.log("Setting submission:", res.data.submissionWithTestCase.sourceCode);
            console.log("Backend response:", res.data);
            set({submission: res.data.submissionWithTestCase })
            toast.success(res.data.message)

        } catch (error) {
            console.log("Error Executing Code", error)
            toast.error("Error Executing Code")
        }finally{
            set({isExecuting:false})
        }
    },
}))