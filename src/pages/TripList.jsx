import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id); // Use optional chaining to safely access user._id
  const tripList = useSelector((state) => state.user?.tripList); // Use optional chaining to safely access user.tripList

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(
        `https://dream-nest-backend.onrender.com/users/${userId}/trips`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
      setLoading(false); // Make sure to handle loading state on error
    }
  };

  useEffect(() => {
    if (userId) {
      getTripList();
    }
  }, [userId]); // Trigger useEffect when userId changes

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.map((trip) => {
          const listingId = trip?.listingId;
          const hostId = trip?.hostId;

          if (!listingId) {
            return null; // Skip rendering if listingId is undefined/null
          }

          // console.log(trip);

          return (
            <ListingCard
              key={listingId._id}
              listingId={listingId._id}
              creator={hostId?._id} // Use optional chaining to safely access hostId._id
              listingPhotoPaths={listingId.listingPhotoPaths}
              city={listingId.city}
              province={listingId.province}
              country={listingId.country}
              category={listingId.category}
              startDate={trip.startDate}
              endDate={trip.endDate}
              totalPrice={trip.totalPrice}
              booking={trip.booking}
            />
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
