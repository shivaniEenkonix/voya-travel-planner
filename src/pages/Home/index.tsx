import { useState } from "react";
import { BottomNavbar, TextInput } from "../../components";

function Home() {
  const [email, setEmail] = useState<string>("");

  return (
    <main className="flex min-h-screen flex-col bg-primary">
      {/* Home Content */}
      <section className="flex-1 rounded-b-[20px] bg-white">
        <div className="p-4">
          Home page
          <TextInput
            label="Email"
            type="email"
            name="email"
            value={email}
            error={email === "" ? "Email is required" : ""}
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
        </div>
      </section>

      {/* Bottom Navbar */}
      <div className="xl:hidden">
        <BottomNavbar />
      </div>
    </main>
  );
}

export default Home;
