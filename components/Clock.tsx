"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" });

/** "Em Belo Horizonte, HH:MM" com o horário local, atualizado ao vivo. */
export function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const d = new Date();
      setNow(d);
      timer = window.setTimeout(tick, 60_000 - (d.getTime() % 60_000) + 50);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <span className="clock">
      <span className="clock__dot" aria-hidden="true" />
      Em Belo Horizonte,{" "}
      <time dateTime={now?.toISOString()} suppressHydrationWarning>
        {now ? fmt.format(now) : "--:--"}
      </time>
    </span>
  );
}
