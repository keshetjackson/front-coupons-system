import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow max-w-screen-xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}