import React, { useState,useRef, useEffect} from "react";
import Barcode from "react-barcode";
import logo from "./assets/ontap.png";
import belforlogo from "./assets/belfor_logo.png";




    const FlippableCard = ({
      name="Victor Emefo",
      role="Product Designer",
      department = "Design",
      staffId="EMP4526",
      validThru="05/24/2026",
      profileUrl = "/images/avatar_5.png",
      org = "OnTap Global Workspace",
      phoneNumber="0734253627",
      signature = "Signature",
      bgColor = "#0B1E35",
      showDetails = true,
    }) => {

     



  
  const [flipped, setFlipped] = useState(false);
  const handleFlip = () => setFlipped((prev) => !prev);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div
      onClick={handleFlip}
      className="relative w-full md:max-w-[400px] cursor-pointer"

      style={{ perspective: "1000px" }}
    >
      {/* === Flip Container === */}
      <div
        className={`relative w-full h-[300px] rounded-2xl transition-transform duration-300`}
        
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          className="absolute inset-0 backface-hidden bg-transparent rounded-3xl p-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* === Card Wrapper === */}
          <div className="flex flex-col w-full rounded-3xl shadow bg-transparent p-0 hover:shadow-lg transition-shadow duration-200">

            {/* === Main Card === */}

            <div
  className={`relative flex flex-col sm:flex-row items-stretch justify-between 
  p-3 sm:p-4 rounded-xl shadow-lg 
  transition-transform duration-200 

  overflow-hidden min-h-[180px] max-h-[300px] w-full
  ${
    bgColor === "silver-gradient"
      ? "bg-[linear-gradient(to_right,white_40%,#A8A9AD_100%)] text-gray-900"
    : bgColor === "blue-purple-gradient"
      ? "bg-gradient-to-tr from-[#001F3F] via-[#102A70] to-[#A020F0] text-white"
    : "text-white"
  }`}
  style={{
    background:
      bgColor === "silver-gradient"
        ? undefined
        : bgColor !== "blue-purple-gradient"
        ? bgColor 
        : undefined,
  }}
>




<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1000 400"
  className="absolute inset-0 w-full h-full opacity-55 pointer-events-none"
  
  preserveAspectRatio="none"
>

  {/* === Bottom-Left Reflective Waves === */}
  {Array.from({ length: 14 }).map((_, i) => {
    const offsetY = i * 10;
    const intensity = 0.55 - i * 0.03;
    const strokeW = 1.1 - i * 0.04;

    return (
      <path
        key={`bottom-${i}`}
        d={`M0 ${360 + offsetY}
           C${200 + i * 5} ${400 - i * 3},
            ${480 + i * 7} ${340 - i * 5},
            800 ${390 - i * 2}
           S${600 + i * 5} ${420 - i * 3},
            900 ${400 - i * 2}`}
        fill="none"
        stroke={`rgba(255,255,255,${intensity})`}
        strokeWidth={strokeW}
      />
    );
  })}
</svg>



              {/* === Left Column: Logo and Profile === */}
              <div className="flex flex-col z-10 h-full flex-shrink-0 space-y-2   ">
              {/* Logo Section */}
              
                <div className="flex flex-col items-start translate-x-4 sm:translate-x-6 ">

                  <div className="flex items-center space-x-1 truncate">
                    <img 
                      src="/images/belfor tech.png" 
                      alt={`${org} logo`} 
                      className="w-7 h-7 object-contain sm:w-5 sm:h-5"
                    />    
                    <h1 className={`text-[12px] sm:text-[13px] font-bold tracking-wide leading-tight truncate max-w-[70px] sm:max-w-[80px] 
        ${bgColor === "silver-gradient" ? "text-gray-900" : "text-white"}`}>
        {org.split(" ")[0].toUpperCase()}
      </h1>
                    
                  </div>
                  <p className={`text-[6.5px] ml-5 sm:text-[7px] tracking-widest uppercase leading-tight truncate max-w-[90px] sm:max-w-[100px] 
      ${bgColor === "silver-gradient" ? "text-gray-700" : "text-gray-300"}`}>
      {org.split(" ").slice(1).join(" ")}
    </p>
    </div> 
    
   

  {/* === Top-Right Metallic Circle Section === */}
<div className="absolute top-0.5 right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center shadow-md">
<div
  className="w-full h-full rounded-full flex items-center justify-center"
  style={{
    background: `
      conic-gradient(
        from 0deg,
        #f2f2f2 0deg,
        #cfcfcf 40deg,
        #b8b8b8 90deg,
        #e0e0e0 140deg,
        #a0a0a0 200deg,
        #d9d9d9 260deg,
        #bfbfbf 320deg,
        #f2f2f2 360deg
      )
    `,
    boxShadow: `
      inset 0 0 8px rgba(255,255,255,0.5),
      inset 0 0 15px rgba(0,0,0,0.25),
      0 0 6px rgba(0,0,0,0.15)
    `,
  }}
>
  <img
    src="/images/logo.png"
    alt="OnTap Logo"
    className="w-6 h-6 sm:w-8 sm:h-8 object-contain mix-blend-multiply"
  />
</div>


</div>




    {/* Profile Image */}
    {bgColor === "blue-purple-gradient" ? (
  <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden border border-[#3EA6FF] shadow-[0_0_15px_3px_rgba(62,166,255,0.6)]">
    <img
      src={profileUrl}
      alt={`${name} Profile`}
      className="w-full h-full object-cover"
    />
  </div>
) : (
  <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] rounded-lg overflow-hidden border border-gray-500">
    <img
      src={profileUrl}
      alt={`${name} Profile`}
      className="w-full h-full object-cover"
    />
  </div>
)}



          {/* Signature & Staff ID */}
          <div className=" mt-4 w-full gap-2 ml-4">
  <h3
    className={`font-semibold italic text-[9px] sm:text-[10px] truncate 
      max-w-[70px] sm:max-w-[80px]
      ${bgColor === "silver-gradient" ? "text-gray-900" : "text-white"}`}
  >
    {signature}
  </h3>

 
</div>

  </div>

              {/* === Middle Section === */}
              <div className="flex flex-col justify-center flex-grow h-full px-1 sm:px-2 mt-6 sm:mt-8 overflow-hidden">
              <div className="min-w-0">
              <h2 className={`text-[13px] sm:text-[14px] font-bold uppercase leading-tight truncate 
      ${bgColor === "silver-gradient" ? "text-black" : "text-white"}`}>
      {name}
    </h2>                  
    <p className={`text-[10px] sm:text-[11px] uppercase truncate 
      ${bgColor === "silver-gradient" ? "text-gray-800" : "text-gray-200"}`}>
      {role}
    </p>               
     </div>
                <div className="min-w-0 mt-2 sm:mt-2.5">
                <p className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-wide 
      ${bgColor === "silver-gradient" ? "text-black" : "text-white"}`}>
      Department
    </p>                 
    <p className={`text-[9px] sm:text-[10px] font-semibold uppercase truncate 
      ${bgColor === "silver-gradient" ? "text-gray-700" : "text-gray-400"}`}>
      {department}
    </p>              
      </div>

      <div className="flex flex-col leading-tight min-w-0 mt-4">
    <p
      className={`text-[8px] sm:text-[9px] uppercase 
        ${bgColor === "silver-gradient" ? "text-gray-800" : "text-gray-400"}`}
    >
      Staff ID
    </p>
    <p
      className={`text-[9px] sm:text-[10px] font-semibold break-all 
        ${bgColor === "silver-gradient" ? "text-black" : "text-white"}`}
    >
      {staffId}
    </p>
  </div>
              </div>

              {/* === Right Section - NFC icons === */}
     
    <div className="flex sm:flex-col items-center justify-center gap-2 sm:gap-1 mt-8 relative">
   

    {/* === Menu  Dots section === */}
    <div className="relative flex items-center justify-center w-6 h-6 rounded-full border transition">
      <img
        src="/images/white nfc.png"
        alt="NFC"
        className="w-8 h-8 object-contain "
      />

<div className="absolute top-[255%] left-[10%]  -translate-y-1/2" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-700 focus:outline-none"
          aria-label="Options"
        >
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <circle cx="10" cy="3" r="2" />
            <circle cx="10" cy="10" r="2" />
            <circle cx="10" cy="17" r="2" />
          </svg>
        </button>

        {/* Dropdown */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-1 w-20 bg-[#102A49] rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-1 text-white hover:bg-blue-700 rounded-md"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  </div>


        {/* === Valid Thru === */}
<div
  className="
    absolute bottom-4 left-1/2 transform 
    -translate-x-[8%] sm:-translate-x-[5%] md:-translate-x-[3%] lg:-translate-x-[-68%] 
    text-center 
  "
>
  <p
    className={`text-[8px] sm:text-[9px] font-semibold uppercase leading-tight 
    ${bgColor === "silver-gradient" ? "text-gray-700" : "text-gray-400"}`}
  >
    Valid Thru
  </p>

  <p
    className={`text-[9px] sm:text-[10px] font-semibold leading-tight 
    ${bgColor === "silver-gradient" ? "text-black" : "text-white"}`}
  >
    {validThru}
  </p>
</div>
    
    </div>

            </div>
            </div>

{/* ================= BACK SIDE ================= */}
<div
  className="absolute inset-0 backface-hidden rounded-3xl bg-transparent p-0"
  style={{
    transform: "rotateY(180deg)",
    backfaceVisibility: "hidden"
  }}
>
  {/* === Card Wrapper  === */}
  <div className="relative flex flex-col  rounded-xl shadow-lg overflow-hidden min-h-[160px] max-h-[220px] w-full bg-white text-gray-900">

  <div className="flex flex-col p-3 sm:p-4">

  {/* === Logos section === */}
  <div className="flex items-center justify-between w-full px-5 pt-1 pb-1 -mt-3 ">

    <img
      src={belforlogo}
      alt={`${org} logo`}
      className="h-6 sm:h-9 object-contain -translate-x-6"
    />

    <img
      src={logo}
      alt="OnTap logo"
      className="h-5 sm:h-8 object-contain translate-x-6"
    />
  </div>

  {/* === Barcode section === */}
  <div className="flex-grow flex flex-col items-center justify-center px-8 -mt-1">
  <Barcode
    value={staffId|| "N/A"}
    format="CODE128"
    width={1.5}
    height={35.5}
    displayValue={false}
    background="#ffffff"
    lineColor="#000000"
  />
  <p className="text-black font-semibold text-[11px] text-lg -mt-2">
    SCAN
  </p>
  <p className="text-[6px] text-center mt-2 leading-snug text-gray-700">
      This cardholder is an authorized employee of{" "}
      <span className="font-semibold">{org}</span>. Verify credentials via the QR code.{" "}
      {org} is not liable for any actions taken without proper verification.
    </p>
</div>
</div>
<div
  className="w-full bg-[#14b8a6] text-white text-center py-1 text-[7px] font-medium "
>
  For any suspicious activity, call {phoneNumber}
</div>


</div>



</div>
</div>


{/* ===== STATIC SECTION BELOW  ===== */}
{showDetails && (
  <>
<div className="flex flex-col justify-start items-start  w-full -mt-24">

  
  {/* Department & Access Level */}
  <div className="flex justify-center items-center rounded-lg w-full h-16 bg-gray-50">
    <div className="flex flex-row justify-between items-center w-full px-4">
      <div className="flex flex-col justify-start items-center gap-0.5">
        <div className="text-sm text-neutral-900 font-semibold">{role}</div>
        <div className="text-xs text-gray-500 font-medium">{department}</div>
      </div>
      <div className="flex flex-col justify-center items-center gap-0.5">
        <div className="text-sm text-neutral-900 font-semibold">Standard</div>
        <div className="text-xs text-gray-500 font-medium">Access Level</div>
      </div>
    </div>
  </div>

  {/* Expiry and Actions */}
  <div className="flex flex-col justify-start items-start gap-4 w-full">
    <div className="flex flex-row justify-start items-center gap-2">
      <img width="16.3" height="16.3" src="/images/expiry.png" alt="Expiry icon" />
      <div className="text-sm text-gray-600 font-medium">Expires: {validThru}</div>
    </div>

    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row justify-start items-center gap-4">
        <img width="18.5" height="18.5" src="/images/pencil.png" alt="Edit" className="cursor-pointer hover:bg-gray-100 p-1 rounded transition" />
        <img width="17.3" height="17.3" src="/images/download.png" alt="Download" className="cursor-pointer hover:bg-gray-100 p-1 rounded transition" />
        <img width="16" height="18.5" src="/images/trash.png" alt="Delete" className="cursor-pointer hover:bg-gray-100 p-1 rounded transition" />
      </div>

      <div className="flex flex-row justify-center items-center gap-1 px-4 py-1.5 rounded-lg border border-teal-500 h-8 cursor-pointer hover:bg-teal-50 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md mr-3 mb-3">

        <img width="16" height="16" src="/images/preview.png" alt="Preview" />
        <div className="text-xs text-teal-500 font-medium">Preview</div>
      </div>
    </div>
  </div>
</div>
</>
)}


  </div>





  );
};

export default FlippableCard;