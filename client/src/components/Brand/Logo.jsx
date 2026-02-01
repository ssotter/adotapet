import { FaPaw } from "react-icons/fa6";

export default function Logo({ subtitle }) {
  return (
    <div className="flex items-center select-none">
      {/* Logo principal */}
      <div className="flex items-center gap-2">
        <FaPaw className="text-[#E58E5E] text-[30px]" />

        <span
          className="
            text-[23px]
            font-semibold
            tracking-wide
            leading-none
            text-[#6B3F2B]
          "
        >
          Adota<span className="text-[#E58E5E]">Pet</span>
        </span>
      </div>

      {/* Região (assinatura) */}
      {subtitle && (
        <span
          className="
            ml-10
            text-[15px]
            text-[#6B3F2B]
            italic
            tracking-wide
            leading-none
          "
          style={{ fontFamily: "cursive" }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
