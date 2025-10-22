import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlayListCreatedByUser from "../components/PlayListCreatedByUser";
import ProblemSolvedByPremiumUser from "../components/SubscriptioonProblemSolvedUsers";
import Score from "../components/Score";
import BookmarkList from "../components/BookmarkList";

const ProfilePage = () => {
  const { authUser, Logout } = useAuthStore();
  const handleLogout = () => {
    Logout()
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-10 px-4 md:px-8">
      {/* Header */}
      <div className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-5xl">
        <div className="card bg-base-100 shadow-2xl rounded-2xl overflow-hidden border border-base-300">
          <div className="card-body p-8 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-28 h-28 ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center pl-12 pt-7 font-bold ">
                  {authUser?.image ? (
                    <img
                      src={authUser.image}
                      alt={authUser.name}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-4xl font-semibold">
                      {authUser?.name ? authUser.name.charAt(0) : "U"}
                    </span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold">{authUser.name}</h2>
                <div className="badge badge-primary text-sm py-2 px-3">
                  {authUser.role}
                </div>
                <p className="text-sm text-base-content/70">
                  {authUser.role === "ADMIN"
                    ? "You have full administrative access."
                    : "You have limited user access."}
                </p>
              </div>

              <div className="ml-50 ">
                <Score />
              </div>
            </div>

            <div className="divider my-8" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="stat bg-base-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <Mail className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-base-content/70">
                    Email
                  </span>
                </div>
                <div className="text-sm break-all">{authUser.email}</div>
              </div>

              {/* User ID */}
              <div className="stat bg-base-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <User className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-base-content/70">
                    User ID
                  </span>
                </div>
                <div className="text-sm break-all">{authUser.id}</div>
              </div>

              {/* Role */}
              <div className="stat bg-base-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-base-content/70">
                    Role
                  </span>
                </div>
                <div className="text-base">{authUser.role}</div>
              </div>

              {/* Image Status */}
              <div className="stat bg-base-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  <Image className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-base-content/70">
                    Profile Image
                  </span>
                </div>
                <div className="text-base">
                  {authUser.image ? "Uploaded" : "Not Set"}
                </div>
                <div className="text-sm text-base-content/60 mt-1">
                  {authUser.image
                    ? "Image available"
                    : "Upload a profile picture"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4 mt-10">
              {/* <button className="btn btn-outline btn-primary rounded-lg">
                Edit Profile
              </button>
              <button className="btn btn-primary rounded-lg">
                Change Password
              </button> */}
              <button 
                className="btn btn-primary rounded-lg "
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="w-full max-w-6xl mt-16 space-y-10">
        <ProblemSolvedByUser />
        <ProblemSolvedByPremiumUser />
        <PlayListCreatedByUser />
        <BookmarkList />
      </div>
    </div>
  );
};

export default ProfilePage;
