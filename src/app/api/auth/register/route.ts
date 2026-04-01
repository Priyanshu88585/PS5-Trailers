import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/User";
import { successResponse, errorResponse, handleApiError } from "@/lib/apiMiddleware";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { name, email, password } = parsed.data;

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) return errorResponse("An account with this email already exists", 409);

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
    const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      provider: "credentials",
    });

    return successResponse(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      "Account created successfully",
      201
    );
  } catch (err) {
    return handleApiError(err);
  }
}
