const NoDataFound = ({ message }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-[10px]">
        <svg
          id="fi_12342375"
          viewBox="0 0 64 64"
          width="50"
          height="50"
          fill="currentColor"
          className="text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m42.48217 19h10.32a9.87186 9.87186 0 0 0 -1.74988-2.34015c-1.59099-1.39385-10.25629-10.79663-12.07012-11.47985v10.32a3.50386 3.50386 0 0 0 3.5 3.5z"></path>
          <path d="m53.60217 21h-11.12a5.50972 5.50972 0 0 1 -5.5-5.5v-11.12a9.99785 9.99785 0 0 0 -2.73-.38h-14.27a10.01648 10.01648 0 0 0 -10 10v36a10.01648 10.01648 0 0 0 10 10h24a10.01648 10.01648 0 0 0 10-10c-.11359-.98645.33356-29.30212-.38-29zm-13.41 21.79a1.00434 1.00434 0 0 1 -1.4201 1.41992l-6.7899-6.78992-6.79 6.79a1.0041 1.0041 0 1 1 -1.42-1.42l6.79-6.79-6.79-6.79a1.0041 1.0041 0 1 1 1.42-1.42l6.79 6.79 6.79-6.79a1.00432 1.00432 0 0 1 1.42 1.42l-6.79 6.79z"></path>
        </svg>
      </div>
      <p className="text-[rgba(45,45,45,0.60)] text-[16px] font-semibold">
        {message}
      </p>
    </div>
  );
};

export default NoDataFound;
