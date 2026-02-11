import { Link, useLocation, Outlet } from "react-router";
import { ClipboardList, Package, PackageCheck, Truck, BarChart3 } from "lucide-react";
import logo from "../../assets/d297d007e7d517878512317b7f233a6bac6dc4bd.png";

const navigationItems = [
  { path: "/planner", label: "Planner (Click to Visualise POV)", icon: ClipboardList },
  { path: "/picker", label: "Picker (Click to Visualise POV)", icon: Package },
  { path: "/packer", label: "Packer (Click to Visualise POV)", icon: PackageCheck },
  { path: "/shipper", label: "Shipper (Click to Visualise POV)", icon: Truck },
  { path: "/management", label: "Management Dashboard (Click to Visualise POV)", icon: BarChart3 },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <img src={logo} alt="Baker Hughes" className="w-full h-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#10B981] text-white"
                        : "text-gray-700 hover:bg-[#10B981]/10 hover:text-[#10B981]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1400px] p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}