"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Features } from "./_components/Features";
import { Footer } from "./_components/Footer";
import { Github } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(172,127,244,0.1),rgba(172,127,244,0.05)_40%,transparent_60%)]" />

        {/* Main content */}
        <div className="text-center px-4 max-w-3xl mx-auto relative z-10">
          {/* Floating app icon */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="w-16 h-16 mx-auto mb-8"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center relative justify-center transform rotate-12">
              <Image src="/logo.png" width={300} height={300} className="absolute -left-2" alt="logo"></Image>
            </div>
          </motion.div>

          {/* Headings */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              A Link in Bio.
              <br />
              Free and Open Source.
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-8">
              Create your personal page to showcase everything you are and
              create, powered by the community.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button
              asChild
              className="bg-primary-500 hover:bg-primary-300 text-white rounded-full px-8 py-6 text-lg font-medium"
            >
              <Link href="/signup">Create Your Page</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 py-6 text-lg font-medium"
            >
              <Link href="https://github.com/yourusername/your-repo">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Features />
      <Footer />
    </div>
  );
}
