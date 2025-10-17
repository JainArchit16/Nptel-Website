import { motion } from "framer-motion";
import React from "react";
const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative p-6 rounded-2xl shadow-lg text-white overflow-hidden bg-gradient-to-br ${color}`}
    >
      <div className="relative z-10">
        <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10 text-white">
        {icon && React.cloneElement(icon, { className: "w-24 h-24" })}
      </div>
    </motion.div>
  );
};

export default StatCard;
