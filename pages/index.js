import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../public/cloudy-day.png";
import search from "../public/place.png";
import location1 from "../public/location.png";
import rain from "../public/rain.png";
import humidity from "../public/humidity.png";
import thermometer from "../public/thermometer.png";
import wind from "../public/wind.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

export default function Home({ data, error }) {
  const [query, setQuery] = useState("Pune");
  const [location, setLocation] = useState({});
  const [current, setCurrent] = useState({});
  const [icon, setIcon] = useState("./cloudy.png");
  const [text, setText] = useState("Sunny");

  const router = useRouter();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.warning("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        toast.warning("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        toast.warning("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        toast.warning("An unknown error occurred.");
        break;
    }
  }

  function showPosition(position) {
    let q = `${position.coords.latitude},${position.coords.longitude}`;
    q = q.toString();
    setQuery(q);
    router.push(`/?location=${q}`);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`?location=${query}`);
  };

  useEffect(() => {
    if (error) {
      toast.error("Something Went Wrong!");
    } else {
      console.log(data);
      setLocation(data.location);
      setCurrent(data.current);
      setIcon(data.current.condition.icon);
      setText(data.current.condition.text);
    }
  }, [data, error]);

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-cyan-500 to-blue-900 centerdiv flex-col font-right">
      <Head>
        <title>Weather App by Annonymous Ninja</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* <div className="">Weather App by Annonymous Ninja</div> */}
      <div className=" bg-gradient-to-b from-cyan-500 to-blue-500 shadow-xl shadow-indigo-900 w-11/12 h-5/6 md:w-80 md:h-4/5 rounded-md relative">
        <div className="bg-white mx-5 my-6 text-md rounded-xl flex justify-evenly">
          <div className="w-6 pt-2">
            <Image src={logo} alt="logo"></Image>
          </div>
          <form onSubmit={handleSubmit} className="bg-white flex rounded-xl">
            <input
              type="text"
              className="w-full px-2 py-2 "
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="eg. London"
            />
          </form>
          <button title="Click to get location" onClick={getLocation}>
            <div className="w-5 pt-2">
              <Image src={search} alt="search"></Image>
            </div>
          </button>
        </div>
        <div className="centerdiv flex-col mt-12 mb-8">
          <img src={icon} alt="cloudy" className="w-1/3" />
          <h1 className="text-4xl font-semibold">{current.temp_c} &#176;C</h1>
          <h1>{text}</h1>
          <div className="flex items-center">
            <div className="w-5 pt-2 mr-1">
              <Image src={location1} alt="search"></Image>
            </div>
            <h1>
              {location.name}, {location.country}
            </h1>
          </div>
        </div>
        <div className="bg-white bg-opacity-60 rounded-t-2xl rounded-b-md px-5 py-6  w-full absolute bottom-0">
          <div className="mx-auto grid grid-cols-2">
            <div className="flex my-5">
              <div className="w-7 pt-2 mr-3">
                <Image src={thermometer} alt="search"></Image>
              </div>
              <div>
                <h1 className="text-md">{current.feelslike_c} &#176;C</h1>
                <h1 className="text-sm">Feels like</h1>
              </div>
            </div>
            <div className="flex my-5">
              <div className="w-7 pt-2 mr-3">
                <Image src={humidity} alt="search"></Image>
              </div>
              <div>
                <h1 className="text-md">{current.humidity} %</h1>
                <h1 className="text-sm">Humidity</h1>
              </div>
            </div>
            <div className="flex my-5">
              <div className="w-7 pt-2 mr-3">
                <Image src={wind} alt="search"></Image>
              </div>
              <div>
                <h1 className="text-md">{current.wind_kph} km/hr</h1>
                <h1 className="text-sm">Wind</h1>
              </div>
            </div>
            <div className="flex my-5">
              <div className="w-7 pt-2 mr-3">
                <Image src={rain} alt="search"></Image>
              </div>
              <div>
                <h1 className="text-md">{current.precip_mm} mm</h1>
                <h1 className="text-sm">Precipitation</h1>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  console.log(query);
  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/current.json",
    params: { q: query.location ? query.location : "Pune" },
    headers: {
      "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_API_KEY,
    },
  };

  try {
    const response = await axios.request(options);

    return {
      props: {
        data: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        error: true,
      },
    };
  }
}
