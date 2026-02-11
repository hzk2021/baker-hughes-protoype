import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { ClipboardList, Package, PackageCheck, Truck, BarChart3, Menu, X } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo + close button */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <img src={logo} alt="Baker Hughes" className="h-auto max-w-[160px]" />
          <button
            className="lg:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
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
                    onClick={() => setSidebarOpen(false)}
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
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile header with hamburger */}
        <header className="lg:hidden flex items-center gap-3 p-4 bg-white border-b border-gray-200">
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <img src={logo} alt="Baker Hughes" className="h-8" />
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-[1400px] p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
