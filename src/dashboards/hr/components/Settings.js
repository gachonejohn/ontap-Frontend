import {React, useState,useRef, useEffect} from 'react';


export default function Settings({ activePage, setActivePage }) {

  
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}