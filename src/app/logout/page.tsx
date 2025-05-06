"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    Cookies.remove("authToken");
    Cookies.remove("userEmail");
    router.replace("/login");
  }, [router]);
  return null;
}
