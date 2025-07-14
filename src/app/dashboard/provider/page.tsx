"use client";
import { logout } from "@/actions/auth";
export default function () {
  return <button onClick={() => logout()}>Logout</button>;
}
