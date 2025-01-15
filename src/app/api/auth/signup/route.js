// src/app/api/auth/signup/route.js
export async function POST(request) {
    const { email, password } = await request.json();
  
    // Add logic for creating a new user (e.g., saving to database)
    // Ensure to handle errors and validations
  
    return new Response('User created successfully', {
      status: 201,
    });
  }
  