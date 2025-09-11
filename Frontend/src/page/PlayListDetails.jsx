import React, { useEffect } from "react";
import { UsePlayListStore } from "../store/usePlayListStore";
import { Link } from "react-router-dom";
import { TrashIcon, Loader2, PencilIcon } from "lucide-react";


const PlayListDetails = () => {
    const { playLists, isLoading,  getPlayListDetails, removeProblemFromPlaylist} =
        UsePlayListStore();
  return (
    <div>PlayListDetails</div>
  )
}

export default PlayListDetails