import { useCallback, useState } from "react";
import { BottomNavbar, OTP_UI, TextInput } from "../../components";

function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((previousData) => ({
        ...previousData,
        [name]: value,
      }));
    },
    []
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;

      setTouched((previousTouched) => ({
        ...previousTouched,
        [name]: true,
      }));
    },
    []
  );

  return (
    <main className="flex min-h-screen flex-col bg-primary">
      <section className="flex-1 rounded-b-[20px] bg-white">
        <div className="flex flex-col gap-6 p-4">
          <OTP_UI/>
        </div>
      </section>

      <div className="xl:hidden">
        <BottomNavbar />
      </div>
    </main>
  );
}

export default Home;