import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      <div className="absolute top-16 left-0 h-1/3 w-1/3 bg-primary opacity-30 blur-3xl rounded-md button-9"></div>
      <h1 className="text-4xl font-extrabold z-10 text-center">
        Welcom to <span className="text-primary">LeetLab</span>
      </h1>

      <p className="mt-4 text-center font-semibold text-gray-500 dark:text-grey-400 z-10" >
        A platform where any body cam test their ability of coding.
      </p>
    </div>
  );
};

export default HomePage;
