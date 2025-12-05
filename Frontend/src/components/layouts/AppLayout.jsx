import Navbar from "@/components/layouts/Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Navbar />
      <main className=" w-full">{children}</main>
    </div>
  );
}
