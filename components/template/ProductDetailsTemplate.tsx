"use client";

import React, { useState } from 'react';
import { useGetProductByIdQuery } from '@/features/products';
import { useGetVariantsQuery } from '@/features/variants';
import { useParams, useRouter } from 'next/navigation';
import { Star, Package, Truck, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductDetailsTemplateProps {
  productId?: number | string;
}

// ─── Variant Types ────────────────────────────────────────────────────────────
interface VariantAttribute {
  id: number;
  attribute_id: number;
  attribute_name: string;
  attribute_type: string;
  value: string;
}

interface Variant {
  id: number;
  product_id: number;
  sku: string | null;
  variant_name: string;
  stock_quantity: number;
  is_in_stock: boolean;
  cost_price: string;
  selling_price: string;
  discount_price: string;
  final_price: string;
  discount_percentage: number;
  is_default: boolean;
  status: number;
  status_label: string;
  attributes: VariantAttribute[];
}

const ProductDetailsTemplate: React.FC<ProductDetailsTemplateProps> = ({
  productId,
}) => {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const id = productId || params.productId;
  const [selectedImage, setSelectedImage] = useState<string>('');

  const { data, isLoading, isError, error } = useGetProductByIdQuery(id!, {
    skip: !id,
  });

  const { data: variantsData, isLoading: variantsLoading } = useGetVariantsQuery(
    { productId: String(id) },
    { skip: !id }
  );

  const variants: Variant[] = variantsData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">
          {t('productdetails.loading.product')}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          {t('productdetails.errors.productError')}: {error?.toString()}
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>{t('productdetails.errors.productNotFound')}</div>
      </div>
    );
  }

  const product = data.data;
  const displayImage = selectedImage || product.main_image;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Back Navigation */}
      <div className="headerpage flex space-y-4">
        <div className="max-w-7xl mx-auto px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            {direction === 'rtl' ? (
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
              {t('productdetails.header.ProductDetails')}
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
                    alt={t('productdetails.images.main')}
                    className="w-full h-20 object-cover hover:opacity-75 transition"
                  />
                </div>
                {product.images.map((image: any) => (
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
                      alt={`${t('productdetails.images.product')} ${image.id}`}
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
                  {t('productdetails.sku')}: {product.sku} •{' '}
                  <span className="text-green-600">
                    {product.stock_quantity !== 0
                      ? product.stock_quantity
                      : t('productdetails.stock.outOfStock')}
                  </span>
                </p>
              </div>

              {/* Pricing Section */}
              <div className="mb-6 pb-6 border-b border-gray-300">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price || 0}
                  </span>
                  {product.discount_percentage && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.discount_percentage || 0}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md text-sm font-semibold">
                    {t('productdetails.pricing.brand')}: 15
                  </div>
                  {product.discount_percentage && (
                    <div className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-semibold">
                      {product.discount_percentage}% {t('productdetails.badges.off')}
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    {t('productdetails.stock.label')}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {product.stock_quantity !== 0
                      ? product.stock_quantity
                      : t('productdetails.stock.outOfStock')}
                  </div>
                </div>
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
                  {product.average_rating.toFixed(1)} ({product.total_reviews}{' '}
                  {t('productdetails.rating.reviews')})
                </span>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    {t('productdetails.tags.label')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: any) => (
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
                  {t('productdetails.buttons.update')}
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition">
                  {t('productdetails.buttons.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('productdetails.sections.description')}
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4 break-words overflow-hidden">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <FeatureCard
              icon={<Package className="w-6 h-6" />}
              title={t('productdetails.features.details')}
              description={product.details_info || ''}
            />
            <FeatureCard
              icon={<Truck className="w-6 h-6" />}
              title={t('productdetails.features.shipping')}
              description={product.shipping_info || ''}
            />
            <FeatureCard
              icon={<RotateCcw className="w-6 h-6" />}
              title={t('productdetails.features.return')}
              description={product.return_info || ''}
            />
          </div>
        </div>

        {/* Variants Table */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('productdetails.sections.variants')} ({variants.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t('productdetails.table.variant')}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t('productdetails.table.attributes')}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t('productdetails.table.price')}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t('productdetails.table.stock')}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t('productdetails.table.discount')}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t('productdetails.table.status')}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {t('productdetails.table.actions.label')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {variantsLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      {t('productdetails.loading.variants')}
                    </td>
                  </tr>
                ) : variants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      {t('productdetails.errors.noVariants')}
                    </td>
                  </tr>
                ) : (
                  variants.map((variant) => (
                    <VariantRow key={variant.id} variant={variant} t={t} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Compatibility */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('productdetails.sections.compatibility')}
          </h2>

          {product.main_vehicle && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {t('productdetails.vehicle.main')}
              </h3>
              <VehicleCard vehicle={product.main_vehicle} isMain t={t} />
            </div>
          )}

          {product.compatible_vehicles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {t('productdetails.vehicle.compatible')} ({product.compatible_vehicles.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.compatible_vehicles.map((vehicle: any) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} t={t} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Specifications */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('productdetails.sections.specifications')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <SpecRow
              label={t('productdetails.specs.manufacturer')}
              value={product.manufacturer_name || ''}
            />
            <SpecRow
              label={t('productdetails.specs.category')}
              value={product.category?.name || ''}
            />
            <SpecRow
              label={t('productdetails.specs.weight')}
              value={`${product.weight} ${t('productdetails.specs.units.kg')}`}
            />
            <SpecRow
              label={t('productdetails.specs.dimensions')}
              value={`${product.length} × ${product.width} × ${product.height} ${t('productdetails.specs.units.cm')}`}
            />
            <SpecRow
              label={t('productdetails.specs.fragile')}
              value={product.is_fragile ? t('productdetails.specs.values.yes') : t('productdetails.specs.values.no')}
            />
            <SpecRow
              label={t('productdetails.specs.status')}
              value={product.status_label}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Helper Components ────────────────────────────────────────────────────────

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
      {icon}
    </div>
    <div className="min-w-0">
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 break-words">{description}</p>
    </div>
  </div>
);

const VariantRow: React.FC<{ variant: Variant; t: (key: string) => string }> = ({ variant, t }) => {
  const colorAttr = variant.attributes.find((a) => a.attribute_type === 'color');
  const otherAttrs = variant.attributes.filter((a) => a.attribute_type !== 'color');

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50">

      {/* Variant Name + Default badge */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{variant.variant_name}</span>
          {variant.is_default && (
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
              {t('productdetails.badges.default')}
            </span>
          )}
        </div>
        {variant.sku && (
          <span className="text-xs text-gray-400 mt-0.5 block">
            {t('productdetails.sku')}: {variant.sku}
          </span>
        )}
      </td>

      {/* Attributes: color swatch + other pills */}
      <td className="py-4 px-4">
        <div className="flex flex-wrap items-center gap-2">
          {colorAttr && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: colorAttr.value.toLowerCase() }}
              />
              <span className="text-sm text-gray-700">{colorAttr.value}</span>
            </div>
          )}
          {otherAttrs.map((attr) => (
            <span
              key={attr.id}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
            >
              {attr.attribute_name}: {attr.value}
            </span>
          ))}
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-4">
        <div className="text-sm font-semibold text-gray-900">
          ${variant.final_price}
        </div>
        {parseFloat(variant.discount_price) > 0 && (
          <div className="text-xs text-gray-400 line-through">
            ${variant.selling_price}
          </div>
        )}
      </td>

      {/* Stock */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              variant.is_in_stock ? 'bg-green-500' : 'bg-red-400'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              variant.is_in_stock ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {variant.is_in_stock
              ? variant.stock_quantity
              : t('productdetails.stock.outOfStock')}
          </span>
        </div>
      </td>

      {/* Discount */}
      <td className="py-4 px-4">
        {variant.discount_percentage > 0 ? (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-semibold">
            {variant.discount_percentage}% {t('productdetails.badges.off')}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            variant.status === 1
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {variant.status_label}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <button
            className="text-gray-400 hover:text-blue-600 transition"
            title={t('productdetails.table.actions.edit')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            className="text-gray-400 hover:text-red-600 transition"
            title={t('productdetails.table.actions.delete')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

const VehicleCard: React.FC<{
  vehicle: any;
  isMain?: boolean;
  t: (key: string) => string;
}> = ({ vehicle, isMain, t }) => (
  <div
    className={`border rounded-lg p-4 ${
      isMain ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
      {isMain && (
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
          {t('productdetails.vehicle.labels.main')}
        </span>
      )}
    </div>
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex justify-between">
        <span>{t('productdetails.vehicle.labels.type')}:</span>
        <span className="font-medium text-gray-900">{vehicle.type?.name}</span>
      </div>
      <div className="flex justify-between">
        <span>{t('productdetails.vehicle.labels.model')}:</span>
        <span className="font-medium text-gray-900">{vehicle.model?.name}</span>
      </div>
      <div className="flex justify-between">
        <span>{t('productdetails.vehicle.labels.bodyType')}:</span>
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