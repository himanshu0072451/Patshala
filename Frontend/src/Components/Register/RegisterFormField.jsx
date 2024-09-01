// import React from "react";
// import { Controller } from "react-hook-form";
// import { MdArrowRightAlt } from "react-icons/md";

// const FormField = ({
//   label,
//   name,
//   type = "text",
//   control,
//   errors,
//   onClick,
//   showButton,
//   handleContinue,
//   disabled,
// }) => (
//   <div className="mt-5 h-fit 2xl:flex 2xl:flex-col 2xl:gap-2">
//     <h1 className="text-lg 2xl:text-2xl font-bold text-cyan-600">{label}</h1>
//     <div className="mail-block w-full flex gap-2 items-center h-8">
//       <MdArrowRightAlt />
//       <Controller
//         name={name}
//         control={control}
//         defaultValue="" // Ensure the input always has a value
//         render={({ field }) => (
//           <input
//             type={type}
//             {...field}
//             className="sm:w-3/4 w-[50%] px-2 font-[Mona] text-base 2xl:text-xl bg-transparent rounded-md font-medium border-[2px] border-zinc-500 outline-none active:bg-zinc-950 "
//             onClick={onClick}
//             disabled={disabled}
//             autoFocus
//             style={{
//               borderWidth: showButton ? "2px" : "0",
//               pointerEvents: disabled ? "none" : "true",
//             }}
//             value={field.value || ""} // Ensure a controlled input by handling undefined values
//           />
//         )}
//       />
//       {showButton && (
//         <button
//           type="button"
//           onClick={handleContinue}
//           className="py-1 px-2 text-base font-light border-[1px] border-zinc-600 rounded-md"
//         >
//           Continue
//         </button>
//       )}
//     </div>
//     {errors[name] && (
//       <p className="text-red-500 2xl:text-lg">{errors[name]?.message}</p>
//     )}
//   </div>
// );

// export default FormField;

// ------------------------------------------------------------

import React from "react";
import { Controller } from "react-hook-form";
import { MdArrowRightAlt } from "react-icons/md";

const FormField = ({
  label,
  name,
  type = "text",
  control,
  errors,
  onClick,
  showButton,
  handleContinue,
  disabled,
}) => (
  <div className="mt-5 h-fit 2xl:flex 2xl:flex-col 2xl:gap-2">
    <h1 className="text-lg 2xl:text-2xl font-bold text-cyan-600">{label}</h1>
    <div className="mail-block w-full flex gap-2 items-center h-8">
      <MdArrowRightAlt />
      <Controller
        name={name}
        control={control}
        defaultValue="" // Ensure the input always has a value
        render={({ field }) => (
          <input
            type={type}
            {...field}
            className={`sm:w-3/4 w-[50%] px-2 font-[Mona] text-base 2xl:text-xl bg-transparent rounded-md font-medium border-[2px] border-zinc-500 outline-none ${
              disabled ? "bg-gray-300" : "bg-transparent"
            }`}
            onClick={onClick}
            disabled={disabled} // Use disabled directly for disabling the field
            autoFocus
            value={field.value || ""} // Ensure a controlled input by handling undefined values
          />
        )}
      />
      {showButton && !disabled && (
        <button
          type="button"
          onClick={handleContinue}
          className="py-1 px-2 text-base font-light border-[1px] border-zinc-600 rounded-md"
        >
          Continue
        </button>
      )}
    </div>
    {errors[name] && (
      <p className="text-red-500 2xl:text-lg">{errors[name]?.message}</p>
    )}
  </div>
);

export default FormField;
