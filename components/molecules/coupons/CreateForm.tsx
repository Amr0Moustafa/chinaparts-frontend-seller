import { useState } from "react";
import { useTranslation } from "react-i18next";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  label: string;
  price: string;
}

interface FormState {
  applyTo: string;
  couponCode: string;
  couponTitle: string;
  discountType: string;
  discountValue: string;
  minimumOrderValue: string;
  usageLimit: string;
  startDate: string;
  endDate: string;
}

type SelectedMap = Record<string, boolean>;

// ─── Data ──────────────────────────────────────────────────────────────────

const products: Product[] = [
  { id: "wheel-covers", label: "Wheel Covers", price: "$89.99" },
  { id: "brake-kits",   label: "Brake Kits",   price: "$299.99" },
  { id: "tire-chains",  label: "Tire Chains",  price: "$19.99" },
  { id: "wheel-disks",  label: "Wheel Disks",  price: "$12.90" },
];

// ─── Icons ─────────────────────────────────────────────────────────────────

const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 4l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Sub-components ────────────────────────────────────────────────────────

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const Checkbox = ({ checked, onChange }: CheckboxProps) => (
  <div
    onClick={onChange}
    className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
      checked
        ? "bg-orange-500 border-orange-500"
        : "bg-white border-gray-300 hover:border-orange-400"
    }`}
  >
    {checked && (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path
          d="M1.5 4.5L3.5 6.5L7.5 2.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────

export default function CreateCouponForm() {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<SelectedMap>({
    "wheel-covers": true,
    "brake-kits": true,
    "tire-chains": true,
    "wheel-disks": false,
  });

  const [form, setForm] = useState<FormState>({
    applyTo: "specific",
    couponCode: "",
    couponTitle: "15% Off Brake Parts Brake System",
    discountType: "",
    discountValue: "20",
    minimumOrderValue: "50",
    usageLimit: "100",
    startDate: "",
    endDate: "",
  });

  const [toast, setToast] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleProduct = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-lg z-50">
          ✓ {t("coupons.form.addCoupon")}
        </div>
      )}

      <div className="w-full bg-white rounded border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Apply Coupon To */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              {t("coupons.form.applyTo")}
            </label>
            <div className="relative">
              <select
                name="applyTo"
                value={form.applyTo}
                onChange={handleChange}
                className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 pr-8"
              >
                <option value="specific">{t("coupons.form.specificProducts")}</option>
                <option value="all">{t("coupons.form.allProducts")}</option>
                <option value="category">{t("coupons.form.category")}</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown />
              </span>
            </div>
          </div>

          {/* Select Products */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              {t("coupons.form.selectProducts")} <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded px-4 py-3 bg-white">
              <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                {[0, 1, 2, 3].map((col) => (
                  <div key={col} className="flex flex-col gap-2">
                    {products.map((product) => (
                      <label
                        key={`${col}-${product.id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selected[product.id]}
                          onChange={() =>
                            col === 0 && toggleProduct(product.id)
                          }
                        />
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {product.label} –{" "}
                          <span className="text-gray-500">{product.price}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coupon Code + Coupon Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("coupons.form.couponCode")}
              </label>
              <input
                name="couponCode"
                value={form.couponCode}
                onChange={handleChange}
                placeholder="e.g., AUTOPART10"
                className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("coupons.form.couponTitle")}
              </label>
              <input
                name="couponTitle"
                value={form.couponTitle}
                onChange={handleChange}
                placeholder="15% Off Brake Parts Brake System"
                className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Discount Type + Discount Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("coupons.form.discountType")}
              </label>
              <div className="relative">
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="w-full appearance-none bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 pr-8"
                >
                  <option value="">{t("coupons.form.discountTypePlaceholder")}</option>
                  <option value="percentage">{t("coupons.form.discountTypePercentage")}</option>
                  <option value="fixed">{t("coupons.form.discountTypeFixed")}</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown />
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("coupons.form.discountValue")}
              </label>
              <input
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
                placeholder="20"
                className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Minimum Order Value + Usage Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("coupons.form.minimumOrderValue")}
              </label>
              <input
                name="minimumOrderValue"
                value={form.minimumOrderValue}
                onChange={handleChange}
                placeholder="50"
                className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("coupons.form.usageLimit")}
              </label>
              <input
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                placeholder="100"
                className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Start Date + End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("coupons.form.startDate")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 pr-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("coupons.form.endDate")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 pr-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <CalendarIcon />
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm px-6 py-2 rounded transition-colors"
            >
              {t("coupons.form.addCoupon")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}