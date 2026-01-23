import { FaPaw } from "react-icons/fa6";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* Ícone */}
      <FaPaw className="text-[#E58E5E] text-[30px]" />

      {/* Texto */}
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
  );
}
