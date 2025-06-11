"use client";

import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast, Toaster } from "sonner";

interface FeedbackFormData {
  name: string;
  message: string;
}

export const Feedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FeedbackFormData>({
    defaultValues: {
      name: "",
      message: "",
    },
  });

  const { mutate: createFeedback } = api.feedback.createFeedback.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      toast.success("Feedback submitted successfully");
      reset();
    },
    onError: () => {
      setIsSubmitting(false);
      toast.error("Failed to submit feedback");
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    setIsSubmitting(true);
    createFeedback({ name: data.name, message: data.message });
  };

  return (
    <>
    <Toaster />
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Share Your Feedback
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            We'd love to hear your thoughts and suggestions
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Your Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                id="name"
                type="text"
                className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                Your Message
              </label>
              <textarea
                {...register("message", { 
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters"
                  }
                })}
                id="message"
                rows={4}
                className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="Share your thoughts with us..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};