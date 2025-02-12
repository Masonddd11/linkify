"use client";

import { motion } from "framer-motion";
import { Layers, Palette, Share2, Layout, Github, Globe } from "lucide-react";

const features = [
  {
    title: "Beautiful Blocks",
    description: "Create stunning layouts with our pre-designed blocks.",
    icon: Layers,
  },
  {
    title: "Custom Themes",
    description: "Choose from various themes or create your own.",
    icon: Palette,
  },
  {
    title: "Social Integration",
    description: "Connect all your social media profiles seamlessly.",
    icon: Share2,
  },
  {
    title: "Drag & Drop",
    description: "Easily arrange your content with drag and drop.",
    icon: Layout,
  },
  {
    title: "Open Source",
    description: "Contribute to the project and make it better for everyone.",
    icon: Github,
  },
  {
    title: "Self-Hostable",
    description: "Host it on your own domain and have full control.",
    icon: Globe,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powered by the community
          </h2>
          <p className="text-lg text-gray-500">
            All the features you need, free and open source
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-10 h-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
