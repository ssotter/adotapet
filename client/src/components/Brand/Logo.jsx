import { FaPaw } from "react-icons/fa6";

export default function Logo({ subtitle }) {
  return (
    <div className="flex items-center select-none">
      {/* Logo principal */}
      <div className="flex items-center gap-2">
        <FaPaw className="text-[#E58E5E] text-[26px] sm:text-[30px]" />

        <span
          className="
            text-[20px] sm:text-[23px]
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
        <>
          {/* Desktop: ao lado */}
          <span
            className="
              hidden sm:inline
              ml-8
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

          {/* Mobile: embaixo */}
          <span
            className="
              sm:hidden
              ml-2
              text-[12px]
              text-[#6B3F2B]
              italic
              tracking-wide
              leading-none
              opacity-80
            "
            style={{ fontFamily: "cursive" }}
          >
            {subtitle}
          </span>
        </>
      )}
    </div>
  );
}
