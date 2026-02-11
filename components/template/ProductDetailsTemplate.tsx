"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useGetProductByIdQuery } from '@/features/products';
import { useParams, useRouter } from 'next/navigation';
import { Star, Package, Truck, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductDetailsTemplateProps {
  productId?: number | string;
  
}

const ProductDetailsTemplate: React.FC<ProductDetailsTemplateProps> = ({ 
  productId,
  
}) => {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const {t ,i18n} = useTranslation();
  const direction=i18n.dir()
  const id = productId || params.productId;
  const [selectedImage, setSelectedImage] = useState<string>('');

  const { data, isLoading, isError, error } = useGetProductByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading product details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          Error loading product: {error?.toString()}
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Product not found</div>
      </div>
    );
  }

  const product = data.data;
  const displayImage = selectedImage || product.main_image;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Back Navigation */}
      <div className="headerpage flex space-y-4 ">
        <div className="max-w-7xl mx-auto px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            {direction === "rtl" ? (
              <ArrowRight
                onClick={() => router.back()}
                className="text-orange-500 cursor-pointer hover:text-orange-600 transition"
                size={24}
              />
            ) : (
              <ArrowLeft
                onClick={() => router.back()}
                className="text-orange-500 cursor-pointer hover:text-orange-600 transition"
                size={24}
              />
            )}
            <h5 className="text-xl font-bold text-slate-800">
              {t("productdetails.header.ProductDetails") || "Product Details"}
            </h5>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <div>
              <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-[400px] object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    displayImage === product.main_image
                      ? 'border-orange-500'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(product.main_image)}
                >
                  <img
                    src={product.main_image}
                    alt="Main"
                    className="w-full h-20 object-cover hover:opacity-75 transition"
                  />
                </div>
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      displayImage === image.url
                        ? 'border-orange-500'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={`Product ${image.id}`}
                      className="w-full h-20 object-cover hover:opacity-75 transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500">
                  SKU: {product.sku} • <span className="text-green-600">{product.stock_quantity !== 0 ? product.stock_quantity : 'Out of Stock'}</span>
                </p>
              </div>

              {/* Pricing Section */}
              <div className="mb-6 pb-6 border-b border-gray-300">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">${product.price || 0}</span>
                  {product.discount_percentage && (
                    <span className="text-xl text-gray-400 line-through">${product.discount_percentage || 0}</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md text-sm font-semibold">
                    BRAND: 15
                  </div>
                  {product.discount_percentage && (
                    <div className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-semibold">
                      {product.discount_percentage}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Stock</div>
                  <div className="text-2xl font-bold text-gray-900">{product.stock_quantity !== 0 ? product.stock_quantity : 'Out of Stock'}</div>
                </div>
                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Supplier</div>
                  <div className="text-2xl font-bold text-gray-900">15</div>
                </div> */}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.average_rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.average_rating.toFixed(1)} ({product.total_reviews} reviews)
                </span>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition">
                  {t("productdetails.buttons.update") || "Update Product"}
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition">
                  {t("productdetails.buttons.delete") || "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t("productdetails.sections.description") || "Product Description"}
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <FeatureCard
              icon={<Package className="w-6 h-6" />}
              title={t("productdetails.features.details") || "Details Info"}
              description={product.details_info || ""}
            />
            <FeatureCard
              icon={<Truck className="w-6 h-6" />}
              title={t("productdetails.features.shipping") || "Shipping Information"}
              description={product.shipping_info || ""}
            />
            <FeatureCard
              icon={<RotateCcw className="w-6 h-6" />}
              title={t("productdetails.features.return") || "Return Policy"}
              description={product.return_info || ""}
            />
          </div>
        </div>

        {/* Variants Table */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t("productdetails.sections.variants") || "Variants"} (5)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t("productdetails.table.type") || "Type"}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t("productdetails.table.value") || "Value"}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t("productdetails.table.price") || "Price"}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t("productdetails.table.supplier") || "Supplier"}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t("productdetails.table.actions") || "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                <VariantRow type="Color" value="ORANGE" price="$0.00" supplier="15" color="orange" />
                <VariantRow type="Color" value="ORANGE" price="$0.00" supplier="15" color="orange" />
                <VariantRow type="Material" value="Steel" price="$3.36" supplier="15" />
                <VariantRow type="Material" value="Steel" price="$4.56" supplier="15" />
                <VariantRow type="Material" value="Steel" price="$9.00" supplier="15" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Compatibility */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t("productdetails.sections.compatibility") || "Vehicle Compatibility"}
          </h2>
          
          {product.main_vehicle && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {t("productdetails.vehicle.main") || "Main Vehicle"}
              </h3>
              <VehicleCard vehicle={product.main_vehicle} isMain />
            </div>
          )}

          {product.compatible_vehicles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {t("productdetails.vehicle.compatible") || "Compatible Vehicles"} ({product.compatible_vehicles.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.compatible_vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Specifications */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t("productdetails.sections.specifications") || "Specifications"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <SpecRow 
              label={t("productdetails.specs.manufacturer") || "Manufacturer"} 
              value={product.manufacturer_name || ""} 
            />
            <SpecRow 
              label={t("productdetails.specs.category") || "Category"} 
              value={product.category?.name || ""} 
            />
            <SpecRow 
              label={t("productdetails.specs.weight") || "Weight"} 
              value={`${product.weight} kg`} 
            />
            <SpecRow 
              label={t("productdetails.specs.dimensions") || "Dimensions"} 
              value={`${product.length} × ${product.width} × ${product.height} cm`} 
            />
            <SpecRow 
              label={t("productdetails.specs.fragile") || "Fragile"} 
              value={product.is_fragile ? 'Yes' : 'No'} 
            />
            <SpecRow 
              label={t("productdetails.specs.status") || "Status"} 
              value={product.status_label} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const VariantRow: React.FC<{
  type: string;
  value: string;
  price: string;
  supplier: string;
  color?: string;
}> = ({ type, value, price, supplier, color }) => (
  <tr className="border-b border-gray-300 hover:bg-gray-50">
    <td className="py-4 px-4 text-sm text-gray-900">{type}</td>
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        {color && (
          <span
            className={`w-4 h-4 rounded-full border-2 border-gray-300`}
            style={{ backgroundColor: color }}
          />
        )}
        <span className="text-sm text-gray-900">{value}</span>
      </div>
    </td>
    <td className="py-4 px-4 text-sm text-gray-900 font-semibold">{price}</td>
    <td className="py-4 px-4 text-sm text-gray-900">{supplier}</td>
    <td className="py-4 px-4">
      <div className="flex items-center gap-2">
        <button className="text-gray-400 hover:text-blue-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button className="text-gray-400 hover:text-red-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
);

const VehicleCard: React.FC<{ vehicle: any; isMain?: boolean }> = ({ vehicle, isMain }) => (
  <div className={`border rounded-lg p-4 ${isMain ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
    <div className="flex items-start justify-between mb-3">
      <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
      {isMain && (
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Main</span>
      )}
    </div>
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex justify-between">
        <span>Type:</span>
        <span className="font-medium text-gray-900">{vehicle.type?.name}</span>
      </div>
      <div className="flex justify-between">
        <span>Model:</span>
        <span className="font-medium text-gray-900">{vehicle.model?.name}</span>
      </div>
      <div className="flex justify-between">
        <span>Body Type:</span>
        <span className="font-medium text-gray-900">{vehicle.body_type?.name}</span>
      </div>
    </div>
  </div>
);

const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

export default ProductDetailsTemplate;