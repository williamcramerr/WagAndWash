"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Cat, RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="text-center max-w-lg">
        {/* Animated Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Cat illustration */}
            <motion.div
              animate={{
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="w-32 h-32 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <Cat className="h-16 w-16 text-destructive" />
              </div>
              {/* Alert icon */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              >
                <AlertTriangle className="h-5 w-5" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            Our cat knocked something over. We&apos;re working on fixing it!
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button size="lg" onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-8 border-t text-sm text-muted-foreground space-y-2"
        >
          <p>If this keeps happening:</p>
          <ul className="list-disc list-inside">
            <li>Try refreshing the page</li>
            <li>Clear your browser cache</li>
            <li>Contact support if the problem persists</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
