import "~/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
    title: "Chess Game",
    description: "Play chess with a full-featured chess engine",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ChessLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
