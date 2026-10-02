'use client';

import { useCategories, useProducts } from '@/api/shop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input, Select } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Sheet } from '@/components/ui/sheet';
import { formatCompactPrice, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PRODUCT_SORTS, type ProductSort } from '@/lib/validations';
import { Loader2, PackageSearch, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type CatalogFilterState, CatalogSidebar } from './catalog-sidebar';
import { ProductCard, ProductCardSkeleton } from './product-card';
import { useAddToCartWithToast } from './use-add-to-cart';
import { useDebouncedValue } from './use-debounced-value';

const SORT_LABELS: Record<ProductSort, string> = {
  newest: 'Mới nhất',
  price_asc: 'Giá thấp đến cao',
  price_desc: 'Giá cao đến thấp',
  best_selling: 'Bán chạy nhất',
};

const PAGE_SIZE = 12;
const optionalNumber = (value: string | null) => (value ? Number(value) : undefined);

export function Catalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL is the source of truth so filters survive reloads and can be shared
  const params = {
    q: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? '',
    minPrice: optionalNumber(searchParams.get('minPrice')),
    maxPrice: optionalNumber(searchParams.get('maxPrice')),
    inStock: searchParams.get('inStock') === 'true',
    sort: (PRODUCT_SORTS as readonly string[]).includes(searchParams.get('sort') ?? '')
      ? (searchParams.get('sort') as ProductSort)
      : 'newest',
    page: Math.max(1, Number(searchParams.get('page')) || 1),
  };

  const updateParams = (patch: Record<string, string | number | boolean | undefined>, resetPage = true) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === '' || value === false) next.delete(key);
      else next.set(key, String(value));
    }
    if (resetPage && !('page' in patch)) next.delete('page');
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const [search, setSearch] = useState(params.q);
  const debouncedSearch = useDebouncedValue(search);
  // Push only the debounced text to the URL
  useEffect(() => {
    if (debouncedSearch.trim() !== params.q) updateParams({ q: debouncedSearch.trim() });
  }, [debouncedSearch]);
  // Keep the box in sync when the URL changes from elsewhere (back button, clear all)
  useEffect(() => setSearch(params.q), [params.q]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: categories } = useCategories();
  const productQuery = {
    q: params.q || undefined,
    category: params.category || undefined,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    inStock: params.inStock ? ('true' as const) : undefined,
    sort: params.sort,
    page: params.page,
    limit: PAGE_SIZE,
  };
  const { data, isLoading, isFetching, isError, error, refetch } = useProducts(productQuery);
  const { add, isPending, pendingId } = useAddToCartWithToast();

  const changeFilters = (patch: Partial<CatalogFilterState>) => updateParams(patch);
  const resetFilters = () => {
    setSearch('');
    router.replace(params.sort === 'newest' ? pathname : `${pathname}?sort=${params.sort}`, { scroll: false });
  };

  const activeCategory = categories?.find((item) => item.id === params.category);
  const chips = [
    params.q && { key: 'q', label: `“${params.q}”`, clear: () => updateParams({ q: undefined }) },
    activeCategory && {
      key: 'category',
      label: activeCategory.name,
      clear: () => updateParams({ category: undefined }),
    },
    (params.minPrice !== undefined || params.maxPrice !== undefined) && {
      key: 'price',
      label:
        params.minPrice !== undefined && params.maxPrice !== undefined
          ? `${formatCompactPrice(params.minPrice)} – ${formatCompactPrice(params.maxPrice)}`
          : params.minPrice !== undefined
            ? `Từ ${formatCompactPrice(params.minPrice)}`
            : `Đến ${formatCompactPrice(params.maxPrice ?? 0)}`,
      clear: () => updateParams({ minPrice: undefined, maxPrice: undefined }),
    },
    params.inStock && { key: 'stock', label: 'Còn hàng', clear: () => updateParams({ inStock: undefined }) },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];
  const filterCount = chips.filter((chip) => chip.key !== 'q').length;

  const sidebar = (
    <CatalogSidebar
      category={params.category}
      minPrice={params.minPrice}
      maxPrice={params.maxPrice}
      inStock={params.inStock}
      categories={categories}
      priceBounds={data?.priceBounds}
      onChange={changeFilters}
      onReset={resetFilters}
      hasFilters={chips.length > 0}
    />
  );

  // Changing filters re-keys the grid so the new results animate in
  const gridKey = JSON.stringify({ ...productQuery, page: params.page });

  return (
    <div>
      <section className='relative animate-fade-up overflow-hidden rounded-3xl bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-10'>
        <div className='-top-16 -right-10 absolute h-56 w-56 rounded-full bg-accent/90' aria-hidden />
        <div className='-bottom-20 absolute right-40 h-40 w-40 rounded-full bg-primary-hover' aria-hidden />
        <div
          className='absolute top-6 right-64 hidden h-14 w-14 rotate-12 rounded-2xl bg-white/10 md:block'
          aria-hidden
        />
        <div className='relative max-w-2xl'>
          <p className='inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-semibold text-sm'>
            <Sparkles className='h-4 w-4' aria-hidden />
            {categories
              ? `${formatNumber(categories.reduce((sum, c) => sum + c.productCount, 0))} sản phẩm đang bán`
              : 'Cửa hàng'}
          </p>
          <h1 className='mt-3 font-bold text-3xl tracking-tight sm:text-4xl'>Tìm món đồ bạn thích</h1>
          <div className='relative mt-6'>
            <Search
              className='-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 h-5 w-5 text-muted-foreground'
              aria-hidden
            />
            <Input
              type='search'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Bạn muốn tìm gì?'
              aria-label='Tìm sản phẩm'
              className='h-[52px] rounded-2xl border-0 pr-12 pl-12 text-base shadow-lift [&::-webkit-search-cancel-button]:hidden'
            />
            {search && (
              <button
                type='button'
                onClick={() => setSearch('')}
                className='-translate-y-1/2 absolute top-1/2 right-2 flex h-9 w-9 animate-scale-in items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                aria-label='Xoá từ khoá'
              >
                <X className='h-4 w-4' aria-hidden />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className='mt-8 grid gap-8 lg:grid-cols-[272px_1fr]'>
        <aside className='hidden lg:block' aria-label='Bộ lọc sản phẩm'>
          <Card className='sticky top-24 max-h-[calc(100vh-7rem)] animate-fade-up overflow-y-auto p-5 [animation-delay:80ms]'>
            {sidebar}
          </Card>
        </aside>

        <section aria-label='Danh sách sản phẩm' aria-busy={isFetching}>
          <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex min-h-10 flex-wrap items-center gap-2'>
              <p className='flex items-center gap-2 font-semibold' aria-live='polite'>
                {data ? `${formatNumber(data.total)} sản phẩm` : 'Đang tải...'}
                {isFetching && !isLoading && (
                  <Loader2 className='h-4 w-4 animate-spin text-primary' aria-label='Đang cập nhật' />
                )}
              </p>
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type='button'
                  onClick={chip.clear}
                  className='inline-flex min-h-8 animate-scale-in items-center gap-1 rounded-full bg-primary-soft py-1 pr-2 pl-3 font-semibold text-primary-hover text-xs transition-colors hover:bg-destructive-soft hover:text-destructive'
                  aria-label={`Bỏ lọc ${chip.label}`}
                >
                  {chip.label}
                  <X className='h-3.5 w-3.5' aria-hidden />
                </button>
              ))}
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' className='relative flex-1 lg:hidden' onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal className='h-5 w-5' aria-hidden />
                Bộ lọc
                {filterCount > 0 && (
                  <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-bold text-[11px] text-white'>
                    {filterCount}
                  </span>
                )}
              </Button>
              <Select
                value={params.sort}
                onChange={(event) =>
                  updateParams({ sort: event.target.value === 'newest' ? undefined : event.target.value })
                }
                aria-label='Sắp xếp'
                className='h-11 min-w-48'
              >
                {PRODUCT_SORTS.map((sort) => (
                  <option key={sort} value={sort}>
                    {SORT_LABELS[sort]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {isError ? (
            <EmptyState
              icon={PackageSearch}
              title='Không tải được sản phẩm'
              description={(error as Error).message}
              action={<Button onClick={() => refetch()}>Thử lại</Button>}
            />
          ) : isLoading ? (
            <div className='grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3'>
              {Array.from({ length: 6 }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : data && data.items.length > 0 ? (
            <div
              key={gridKey}
              className={cn(
                'grid grid-cols-2 gap-3 transition-opacity duration-200 sm:gap-5 md:grid-cols-3',
                isFetching && 'opacity-60'
              )}
            >
              {data.items.map((product, index) => (
                <ProductCard
                  key={product.id}
                  index={index}
                  product={product}
                  onAdd={(id) => add(id)}
                  adding={isPending && pendingId === product.id}
                />
              ))}
            </div>
          ) : (
            <div className='animate-fade-up'>
              <EmptyState
                icon={PackageSearch}
                title='Không tìm thấy sản phẩm phù hợp'
                description={
                  chips.length > 0
                    ? 'Thử bỏ bớt bộ lọc, mở rộng khoảng giá hoặc tìm bằng từ khoá ngắn hơn.'
                    : 'Cửa hàng chưa có sản phẩm nào, hãy quay lại sau nhé.'
                }
                action={
                  chips.length > 0 && (
                    <Button variant='outline' onClick={resetFilters}>
                      Xoá tất cả bộ lọc
                    </Button>
                  )
                }
              />
            </div>
          )}

          {data && (
            <div className='mt-10'>
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={(page) => {
                  updateParams({ page: page > 1 ? page : undefined }, false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </section>
      </div>

      <Sheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title='Bộ lọc'
        footer={
          <Button className='w-full' onClick={() => setFiltersOpen(false)}>
            {data ? `Xem ${formatNumber(data.total)} sản phẩm` : 'Xem sản phẩm'}
          </Button>
        }
      >
        {sidebar}
      </Sheet>
    </div>
  );
}
