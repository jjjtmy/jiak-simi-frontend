import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import { getplaceIDbyCuisine } from "../../service/places";
import { getDishIDByPlaceID } from "../../service/dishes";
import { useParams } from "react-router-dom";

export default function ResultsPage() {
  const { cuisine } = useParams(); //get cuisine
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function filterByCuisine() {
      try {
        setIsLoading(true);
        const allPlaceIDs = await getplaceIDbyCuisine(cuisine); //returns array
        console.log(`allPlaceIDs`, allPlaceIDs);

        const allDishIDs = await Promise.all(
          allPlaceIDs.map(async (placeID) => {
            console.log(`eachplaceID`, placeID._id);
            const dishIDs = await getDishIDByPlaceID(placeID._id);
            return dishIDs;
          })
        );

        console.log(allDishIDs);

        setCards(allDishIDs);
      } catch (error) {
        console.error("Error fetching dishes by cuisines:", error);
        setError("Something chaodah already, try another cuisine!");
      } finally {
        setIsLoading(false);
      }
    }

    filterByCuisine();
  }, []);

  if (isLoading) {
    return (
      <Flex align="center" justify="center" height="30vh" width="100vw">
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (error) return <div>Error: {error}</div>;
  if (cards == 0) return <div>No makan in this cuisine yet!</div>;

  return (
    <div style={styles.page}>
      <div style={styles.grid}>
        {cards.map((card) => (
          <FoodCard key={card._id} dish_id={card._id} style={styles.card} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    padding: "20px",
    width: "100vw",
  },
  card: {
    padding: "20px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};
