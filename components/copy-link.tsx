import { Copy } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

interface CopyLinkProps {
  link: string
}

export function CopyLink({ link }: CopyLinkProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Alert className="mt-4">
        <AlertDescription className="flex flex-col gap-2">
          <p>Share this link with your opponent:</p>
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
            <code className="text-sm flex-1 overflow-hidden text-ellipsis">{link}</code>
            <Button size="sm" variant="ghost" onClick={copyLink} className="flex-shrink-0">
              <Copy className="h-4 w-4 mr-1" />
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
  )
}