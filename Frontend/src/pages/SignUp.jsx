import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
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
          <form className="flex flex-col gap-4">

            <div>
              <Label htmlFor="username">Your username</Label>
              <TextInput
                type="text"
                id="username"
                placeholder="John"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Your email</Label>
              <TextInput
                type="email"
                id="email"
                placeholder="johndeo@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Your password</Label>
              <TextInput type="password" id="password" required />
            </div>

            <Button
              className="bg-linear-to-r from-slate-900 via-teal-500 to-cyan-400"
              type="submit"
            >
              Sign Up
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account? </span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SignUp;
