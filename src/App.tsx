import Home from "./pages/Home";
import Splash from "./pages/splash/Splash";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Add these pages later */}
      {/* <Route path="/explore" element={<Explore />} /> */}
      {/* <Route path="/trips" element={<Trips />} /> */}
      {/* <Route path="/more" element={<More />} /> */}
    </Routes>
  );
}

export default App;