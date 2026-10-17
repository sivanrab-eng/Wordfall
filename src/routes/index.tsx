import { createFileRoute } from "@tanstack/react-router";
import { Wordfall } from "@/components/Wordfall";
import { wordfallMeta } from "@/lib/wordfall-config";
export const Route = createFileRoute("/")({ head: () => ({ meta: wordfallMeta }), component: Wordfall });
