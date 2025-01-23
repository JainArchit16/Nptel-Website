import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const POST = async (request) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const name = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    // const otp = formData.get("otp");

    if (!name || !email || !password || !confirmPassword) {
      return new Response(
        JSON.stringify({
          message: "All fields are required",
          success: false,
        }),
        { status: 403 }
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({
          message: "Passwords don't match",
          success: false,
        }),
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "User already exists",
          success: false,
        }),
        { status: 401 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });
    return new Response(
      JSON.stringify({
        message: "User created successfully",
        user: { userId: user.userId, name: user.name, email: user.email },
        success: true,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err.message);
    return new Response(
      JSON.stringify({
        message: "Failed to sign up",
        success: false,
        error: err.message,
      }),
      { status: 500 }
    );
  }
};
