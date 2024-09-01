import { TypeAnimation } from "react-type-animation";

const TypingAnimation = ({ handleAnimation }) => {
  return (
    <div>
      <TypeAnimation
        sequence={[
          2000,
          `Welcome to PatShala!\n Let’s begin the adventure`,
          () => handleAnimation(),
        ]}
        speed={50}
        style={{ whiteSpace: "pre-line" }} //fontSize: "1rem"
        className="text-base sm:text-lg 2xl:text-2xl"
        repeat={0}
      />
    </div>
  );
};

export default TypingAnimation;
