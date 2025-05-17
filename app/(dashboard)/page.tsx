import Homepage from "@/components/compositions/homepage";

export default function Home() {
  return (
    <main className="flex h-[calc(100svh-var(--header-height)-1px)]! flex-col items-center justify-between px-12 py-8 max-w-7xl">
      <Homepage />
    </main>
  );
}
