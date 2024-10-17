import { useState } from "react";
import { downloadFile } from "~/lib/utils";
import { useToast } from "./use-toast";

export default function useDownload() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const download = async ({ url, name }: { url: string; name: string }) => {
    setIsLoading(true);
    try {
      await downloadFile({ url, name });
    } catch (_) {
      toast({
        title: "Something went wrong.",
        description:
          "Sorry we can't download the file at the moment. Try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { download, isLoading };
}
