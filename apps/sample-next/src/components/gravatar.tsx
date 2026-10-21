import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/skeleton";
import { logger } from "@/utils/logger";
import { sha256 } from "@/utils/sha256";

export function Gravatar({
  email,
  size = 128,
  fallbackUrl = "https://dashboard.notifica.re/assets/images/no-gravatar-blue.png",
}: GravatarProps) {
  const [hash, setHash] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHash() {
      setLoading(true);

      try {
        const result = await sha256(email.trim().toLowerCase());
        setHash(result);
      } catch (error) {
        logger.error(`(User avatar) It was not possible to hash the email: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    loadHash();
  }, [email]);

  const url = hash
    ? `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${fallbackUrl}`
    : fallbackUrl;

  return (
    <div className="relative">
      {!loading ? (
        <Image className="rounded-full shrink-0" src={url} alt="Avatar" width={32} height={32} />
      ) : (
        <Skeleton className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-600" />
      )}
    </div>
  );
}

type GravatarProps = {
  email: string;
  size?: number;
  fallbackUrl?: string;
};
