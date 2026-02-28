"use client";

import { useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function Home() {
  useEffect(() => {
    // Test API connection
    api.getPerformance()
      .then(() => console.log("API connected"))
      .catch((e) => console.log("API not available:", e));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                📈 eToro Trading
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link href="/strategy" className="text-gray-700 hover:text-indigo-600">
                Strategy Builder
              </Link>
              <Link href="/learn" className="text-gray-700 hover:text-indigo-600">
                Learn
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trading for Dummies
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your beginner-friendly guide to profitable trading
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Link href="/dashboard" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
              <p className="text-gray-600">View your positions, signals, and performance</p>
            </Link>
            
            <Link href="/strategy" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Set Goals</h3>
              <p className="text-gray-600">Define your trading targets and build strategies</p>
            </Link>
            
            <Link href="/learn" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Learn</h3>
              <p className="text-gray-600">Master trading concepts and strategies</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
