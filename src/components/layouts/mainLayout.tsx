import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="max-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow  w-full mx-auto lg:px-8 p-2 py-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}