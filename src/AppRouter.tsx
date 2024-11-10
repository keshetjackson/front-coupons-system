import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./components/layouts/mainLayout";
import { CouponEntryPage } from "./pages/CouponEntryPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ReportsPage } from "./pages/ReportsPage";
import { UsersPage } from "./pages/UsersPage";
import { CouponsPage } from "./pages/CouponsPage";


export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<CouponEntryPage />} />
          <Route path="/coupons/test" element={<CouponEntryPage />} />

            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/coupons" element={<CouponsPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
