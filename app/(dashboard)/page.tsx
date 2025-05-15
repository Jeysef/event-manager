import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-[calc(100svh-var(--header-height)-1px)]! flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">Welcome to the dashboard!</p>
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
    </main>
  );
}
