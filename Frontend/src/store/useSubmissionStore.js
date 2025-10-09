import {create} from "zustand"

import {axiosInstance} from "../libs/axios"

import toast from "react-hot-toast"

export const useSubmissionStore = create((set)=>({
    isLoading:null,
    submissions:[],
    submission:null,
    submissionCount:null,

    getAllSubmissions: async()=>{
        try {
            set({isLoading:true})
            const res = await axiosInstance.get("/submission/get-all-submissions")
            set({submissions: res.data.submissions})
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error in getting all submissions : ",error)
            toast.error("Error in getting all submissions")
        }finally{
            set({isLoading:false})
        }
    },

    getSubmissionForPeoblem: async(problemId)=> {
        try {
            const res = await axiosInstance.get(`/submission/get-submissions/${problemId}`)
            console.log("Submission for problem is :", res.data)
            set({submission: res.data.submissions}) // May the issue came here as res.data.submissions to be there
        } catch (error) {
            console.log("Error getting submission for problem : ", error)
            toast.error("Error getting submission for problem")
        }
    },

    getSubmissionCountForProblem:async(problemId) => {
        try {
            const res = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`)
            set({submissionCount: res.data.count})
        } catch (error) {
            console.log("Error in submission count", error)
            toast.error("Error in submission count")
        }
    }
}))


export const useSubscriptionSubmissionStore = create((set)=>({
    isLoading:null,
    submissions:[],
    submission:null,
    submissionCount:null,

    getAllSubmissions: async()=>{
        try {
            set({isLoading:true})
            const res = await axiosInstance.get("/subscription-submission/get-all-submissions")
            set({submissions: res.data.submissions})
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error in getting all submissions : ",error)
            toast.error("Error in getting all submissions")
        }finally{
            set({isLoading:false})
        }
    },

    getSubmissionForPeoblem: async(problemId)=> {
        try {
            const res = await axiosInstance.get(`/subscription-submission/get-submissions/${problemId}`)
            console.log("Submission for subscription problem is :", res.data)
            set({submission: res.data.submissions}) // May the issue came here as res.data.submissions to be there
            console.log("Response in the get submission for problem : ", res.data.submissions)
        } catch (error) {
            console.log("Error getting submission for problem : ", error)
            toast.error("Error getting submission for problem")
        }
    },

    getSubmissionCountForProblem:async(problemId) => {
        try {
            const res = await axiosInstance.get(`/subscription-submission/get-submissions-count/${problemId}`)
            set({submissionCount: res.data.count})
        } catch (error) {
            console.log("Error in submission count", error)
            toast.error("Error in submission count")
        }
    }
}))