const CardFooter = () => {
  return (
    <div className=" footer absolute bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="relative h-full">
        <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
          <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#0093D3]/50 focus-visible:ring-offset-2 text-[#0093D3] underline-offset-4 hover:underline hover:brightness-110 h-7 rounded-md px-3 text-xs gap-1.5 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              ></path>
            </svg>
            Add Allergy
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#0093D3]/50 focus-visible:ring-offset-2 text-[#0093D3] underline-offset-4 hover:underline hover:brightness-110 h-7 rounded-md px-3 text-xs shrink-0">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardFooter;
