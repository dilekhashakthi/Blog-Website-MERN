import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("All fiels are required..!");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);

      if (response.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-12.5">
        {/* left side */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-linear-to-r from-slate-900 via-teal-500 to-cyan-400 rounded-lg text-white">
              Nexora
            </span>
            <span className="text-black dark:text-white">Blogs</span>
          </Link>

          {/* Welcome Text */}
          <p className="text-sm mt-5">
            Welcome to Nexora Blogs! <br />
            Explore, read, and share amazing ideas with the world.
          </p>

          {/* Mini Description */}
          <p className="text-sm mt-2">
            Sign up with your email and password, or continue with Google to
            start your journey. Discover fresh articles, share your thoughts,
            and grow your community.
          </p>
        </div>

        {/* right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username">Your username</Label>
              <TextInput
                type="text"
                id="username"
                name="username"
                placeholder="John"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="email">Your email</Label>
              <TextInput
                type="email"
                id="email"
                name="email"
                placeholder="johndeo@example.com"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="password">Your password</Label>
              <TextInput
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
              />
            </div>

            <Button
              className="bg-linear-to-r from-slate-900 via-teal-500 to-cyan-400"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account? </span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
