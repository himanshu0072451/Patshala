import React from "react";

const Button = ({ isLoading, name }) => {
  return (
    <div className="btn-wrap h-fit w-full flex justify-center items-center mt-2">
      <button
        type="submit"
        disabled={isLoading}
        className={`py-1 px-2 w-full text-base font-base border-[1px] border-zinc-600 rounded-md mx-auto ${
          isLoading
            ? "bg-gray-800 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-800"
        }`}
      >
        {isLoading ? "Sending..." : name}
      </button>
    </div>
  );
};

export default Button;
