import { redirect } from "next/navigation";

export default function Home() {
  // Redirect user to login
  redirect("/auth/login");
}
