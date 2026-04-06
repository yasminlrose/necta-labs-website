'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useLiveCounters(refreshInterval = 30000) {
  const [preorderCount, setPreorderCount] = useState<number>(0);
  const [waitlistCount, setWaitlistCount] = useState<number>(0);

  const fetchCounts = async () => {
    const [preorders, waitlist] = await Promise.all([
      supabase.rpc("get_confirmed_preorder_count"),
      supabase.rpc("get_waitlist_count"),
    ]);
    if (preorders.data !== null) setPreorderCount(preorders.data);
    if (waitlist.data !== null) setWaitlistCount(waitlist.data);
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { preorderCount, waitlistCount };
}
