import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request) => {
  try {
    // Parse the request body
    const { userId, gender, college } = await request.json();

    console.log(userId, gender, college);

    // Validate the userId
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!gender || !college) {
      return NextResponse.json(
        { message: "Gender and college are required" },
        { status: 400 }
      );
    }

    // Update the user's profile in the database
    const updatedUser = await prisma.user.update({
      where: { userId: userId },
      data: { gender: gender, college: college },
    });
    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
};
