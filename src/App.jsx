import React, { useState, useEffect } from "react";
import { MarketplaceProvider, useMarketplace } from "./context/MarketplaceContext";
import RoleBanner from "./components/RoleBanner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastNotification from "./components/ToastNotification";
import CartDrawer from "./components/CartDrawer";
import AuthModal from "./components/AuthModal";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

// Customer Pages
import Home from "./pages/customer/Home";
import CategoriesPage from "./pages/customer/CategoriesPage";
import CartPage from "./pages/customer/CartPage";
import StoreDirectoryPage from "./pages/customer/StoreDirectoryPage";
import StorePage from "./pages/customer/StorePage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import FaqPage from "./pages/customer/FaqPage";
import ContactPage from "./pages/customer/ContactPage";

// Vendor Pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorProfile from "./pages/vendor/VendorProfile";
import VendorReviews from "./pages/vendor/VendorReviews";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";
import AdminReviews from "./pages/admin/AdminReviews";

function MainApp() {
  const {
    userRole,
    activeVendor,
    isAuthModalOpen,
    authModalRole,
    closeAuthModal
  } = useMarketplace();

  // Tab State
  const [activeTab, setActiveTab] = useState("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Selected Item states
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Switch default tab when role changes
  useEffect(() => {
    if (userRole === "customer") {
      setActiveTab("home");
    } else if (userRole === "vendor") {
      setActiveTab("vendor-dashboard");
    } else if (userRole === "admin") {
      setActiveTab("admin-dashboard");
    }
  }, [userRole]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Utility Bar */}
      <RoleBanner setActiveTab={setActiveTab} />

      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsCartOpen={setIsCartOpen}
        setSelectedProduct={setSelectedProduct}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Customer Views */}
        {userRole === "customer" && (
          <>
            {activeTab === "home" && (
              <Home
                setActiveTab={setActiveTab}
                setSelectedVendor={setSelectedVendor}
                setSelectedProduct={setSelectedProduct}
                setSelectedCategory={setSelectedCategory}
              />
            )}
            {activeTab === "categories" && (
              <CategoriesPage
                setActiveTab={setActiveTab}
                setSelectedProduct={setSelectedProduct}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}
            {activeTab === "stores" && (
              <StoreDirectoryPage
                setActiveTab={setActiveTab}
                setSelectedVendor={setSelectedVendor}
              />
            )}
            {activeTab === "store-detail" && (
              <StorePage
                vendor={selectedVendor}
                setActiveTab={setActiveTab}
                setSelectedProduct={setSelectedProduct}
              />
            )}
            {activeTab === "product-detail" && (
              <ProductDetailPage
                product={selectedProduct}
                setActiveTab={setActiveTab}
                setSelectedVendor={setSelectedVendor}
                setSelectedProduct={setSelectedProduct}
              />
            )}
            {activeTab === "cart" && (
              <CartPage
                setActiveTab={setActiveTab}
                setSelectedProduct={setSelectedProduct}
              />
            )}
            {activeTab === "checkout" && (
              <CheckoutPage setActiveTab={setActiveTab} />
            )}
            {activeTab === "my-orders" && (
              <MyOrdersPage setActiveTab={setActiveTab} />
            )}
            {activeTab === "faq" && (
              <FaqPage />
            )}
            {activeTab === "contact" && (
              <ContactPage setActiveTab={setActiveTab} />
            )}
          </>
        )}

        {/* Vendor Portal Views */}
        {userRole === "vendor" && (
          <>
            {activeTab === "vendor-dashboard" && <VendorDashboard setActiveTab={setActiveTab} />}
            {activeTab === "vendor-products" && <VendorProducts />}
            {activeTab === "vendor-orders" && <VendorOrders />}
            {activeTab === "vendor-profile" && <VendorProfile />}
            {activeTab === "vendor-reviews" && <VendorReviews />}
          </>
        )}

        {/* Admin Portal Views */}
        {userRole === "admin" && (
          <>
            {activeTab === "admin-dashboard" && <AdminDashboard setActiveTab={setActiveTab} />}
            {activeTab === "admin-vendors" && <AdminVendors />}
            {activeTab === "admin-orders" && <AdminOrders />}
            {activeTab === "admin-reviews" && <AdminReviews />}
            {activeTab === "admin-reports" && <AdminReports />}
          </>
        )}
      </main>


      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => setActiveTab("checkout")}
        onViewCartPage={() => setActiveTab("cart")}
      />

      {/* Toast Pop-up Alerts */}
      <ToastNotification />

      {/* Global Role-Segregated Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultRole={authModalRole}
        setActiveTab={setActiveTab}
      />

      {/* Floating WhatsApp Concierge for Grand Cayman Shoppers */}
      <FloatingWhatsApp />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <MainApp />
    </MarketplaceProvider>
  );
}
