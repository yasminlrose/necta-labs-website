'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const WholesalePage = () => {
  const router = useRouter();
  useEffect(() => { router.replace('/stockist'); }, [router]);
  return null;
};

export default WholesalePage;
