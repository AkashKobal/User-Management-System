import React from 'react'
import Header from '../components/Header'

const Home = () => {
    return (
        <div>
            <Header />
            <div className="container text-center text-indigo-700 mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-indigo-700 mb-4">Welcome to the Authentication System</h1>
                <p className="text-gray-700 mb-6">This is a simple authentication system built with React and Spring Boot.</p>
                <p className="text-gray-700">Please use the navigation menu to explore the application.</p>
            </div>
        </div>
    )
}

export default Home