import React from "react";
import { Link, Head } from "@inertiajs/react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function Error403({
  message = "You don’t have permission to access this page."
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-sky-200 px-4">
      <Head title="مركز وسائل الإيضاح" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-md w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden"
      >
        {/* Ambient Gradients */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-400/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/40 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-10 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-xl"
          >
            <ShieldAlert className="h-10 w-10 text-white" />
          </motion.div>

          {/* Code */}
          <h1 className="text-7xl font-extrabold tracking-tight text-slate-800">
            4<span className="text-blue-600">0</span>3
          </h1>

          {/* Title */}
          <h2 className="mt-4 text-2xl font-semibold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
            Access Restricted
          </h2>

          {/* Message */}
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {message}
          </p>

          {/* Divider */}
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

          {/* Actions */}
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={route("home")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:scale-105 hover:shadow-xl transition text-decoration-none"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-white/60 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:scale-105 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
