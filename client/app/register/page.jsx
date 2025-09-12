"use client";

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";



const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [picture, setPicture] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("email", form.email);
    formData.append("password", form.password);

    // 👇 must be "picture" (matches backend)
    if (picture) {
      formData.append("image", picture);
    }

    try {
        setLoading(true)
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      // await setCookies("token", token)
     
      window.location.href = "/login"
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
        setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-sm bg-white/80 backdrop-blur-md border border-neutral-200/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Create account
          </h2>
          <p className="text-sm text-neutral-600 mt-2">Join us today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
                autoComplete="given-name"
                onChange={handleChange}
                value={form.firstName}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200/60 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                autoComplete="family-name"
                onChange={handleChange}
                value={form.lastName}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200/60 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              onChange={handleChange}
              value={form.email}
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200/60 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              onChange={handleChange}
              value={form.password}
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200/60 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Profile Picture
            </label>
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setPicture(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-neutral-300 hover:border-neutral-400 p-6 rounded-xl text-center cursor-pointer transition-all duration-200 bg-neutral-50/50 hover:bg-neutral-50"
                >
                  <input {...getInputProps()} name="image" />
                  {picture ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-neutral-700">{picture.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className="w-8 h-8 text-neutral-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-neutral-600">
                          <span className="font-medium text-neutral-900">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-neutral-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          
          {/* Image preview */}
          {picture && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={URL.createObjectURL(picture)}
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setPicture(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          {/* Terms and conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-4 h-4 mt-0.5 text-neutral-600 bg-neutral-50 border-neutral-300 rounded focus:ring-neutral-300"
            />
            <label htmlFor="terms" className="text-sm text-neutral-600">
              I agree to the{" "}
              <a href="#" className="font-medium text-neutral-900 hover:text-neutral-700 underline underline-offset-4">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-neutral-900 hover:text-neutral-700 underline underline-offset-4">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 rounded-xl text-white font-medium transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-neutral-600 text-sm">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="font-medium text-neutral-900 hover:text-neutral-700 transition-colors underline underline-offset-4"
            >
              Sign in
            </a>
          </p>
        </div>
        
        {/* Optional: Social registration */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or register with</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-2.5 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 text-sm font-medium text-neutral-700 transition-all duration-200">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            
            <button className="flex items-center justify-center px-4 py-2.5 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 text-sm font-medium text-neutral-700 transition-all duration-200">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.120.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(RegisterForm), { ssr: false });
