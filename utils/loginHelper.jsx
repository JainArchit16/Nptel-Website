import { signIn, signOut } from "next-auth/react";

export async function doLogout() {
  await signOut({ callbackUrl: "/", redirect: true });
}

export async function doCredentialLogin(email, password) {
  try {
    const response = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    console.log(response);
    return response;
  } catch (err) {
    throw err;
  }
}
