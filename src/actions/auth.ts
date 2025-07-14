import { LoginFormSchema, SignupFormSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/sessions";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signup(state: any, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // prepare the user data for db insertion
  const { username, email, password, role } = validatedFields.data;
  // check for existing emails and usernames
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  //if user already exist return error
  if (existingUser) {
    //  if email matches
    if (existingUser.email === email) {
      return {
        errors: {
          email: "Email already exists",
        },
      };
    }
    // if username matches
    if (existingUser.username === username) {
      return {
        errors: {
          username: "Username already exists",
        },
      };
    }
  }
  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
    },
  });
  // something went wrong while creating a user
  if (!user) {
    return {
      errors: {
        message: "An error occurred while creating your account.",
      },
    };
  }
  // create the session
  await createSession(user.id, user.role);

  // redirect the user to appropriate page
  redirect("/dashboard");
}

// login action

export async function login(state: any, formData: FormData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // prepare the user data for db checking
  const { email, password } = validatedFields.data;
  // check for valid Email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  //if user already exist return error
  if (!user) {
    //  if email is not valid
    return {
      errors: {
        email: {
          message: "Email is not valid exists",
        },
      },
    };
  }
  // check hashed password
  const isValidPassword = await bcrypt.compare(password, user.password);

  // check if the password is valid
  if (!isValidPassword) {
    return {
      errors: {
        password: {
          message: "Incorrect password",
        },
      },
    };
  }

  // create the session
  await createSession(user.id, user.role);

  // redirect the user to appropriate page
  redirect("/dashboard/customer");
}
