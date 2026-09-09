import { useCallback, useState } from "react";
import { BottomNavbar, TextInput } from "../../components";

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
          <h1>Input States Testing</h1>

          {/* Error State Test */}
          <TextInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            state={
              touched.name
                ? !formData.name
                  ? "error"
                  : "success"
                : "default"
            }
            error={
              touched.name && !formData.name
                ? "Name is required"
                : ""
            }
            onBlur={handleBlur}
            onChange={handleChange}
          />

          {/* Success State Test */}
          <TextInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            state={
              touched.email
                ? !formData.email
                  ? "error"
                  : "success"
                : "default"
            }
            error={
              touched.email && !formData.email
                ? "Email is required"
                : ""
            }
            onBlur={handleBlur}
            onChange={handleChange}
          />

          {/* Default State Test */}
          <TextInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            state={
              touched.password
                ? !formData.password
                  ? "error"
                  : "success"
                : "default"
            }
            error={
              touched.password && !formData.password
                ? "password is required"
                : ""
            }
            onBlur={handleBlur}
            onChange={handleChange}
          />

          {/* Disabled State Test */}
          <TextInput
            label="Disabled Input"
            type="text"
            name="disabled"
            value=""
            disabled={true}
            state="default"
            onChange={handleChange}
          />
        </div>
      </section>

      <div className="xl:hidden">
        <BottomNavbar />
      </div>
    </main>
  );
}

export default Home;