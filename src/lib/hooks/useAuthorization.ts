import { usePathname, useRouter } from "@/i18n/routing";
import { isAllowedPath } from "@/utils";

export default function useAuthorization(paths: string[]) {
  const router = useRouter();
  const currentPath = usePathname();

  const isAllowed = isAllowedPath(currentPath, paths);

  if (!isAllowed) {
    router.push("/forbidden");
  }
}
