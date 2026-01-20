import { Loader2, Store, Tag, Info, Plus } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCartStore } from '../../store/cartStore';
import { Product } from '../../types';

const UserView = () => {
  const { data: products, isLoading } = useProducts();
  const { addToCart } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-slate-400 font-medium">Cargando catálogo de productos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white italic">
            NUESTRO <span className="text-indigo-400">CATÁLOGO</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Explora las mejores ofertas tecnológicas disponibles hoy.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {products?.length || 0} Productos Online
          </span>
        </div>
      </div>

      {!products || products.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 p-20 rounded-[3rem] text-center">
          <Store size={48} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 italic">
            No hay productos disponibles en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] p-2 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="relative aspect-square bg-slate-950 rounded-[2rem] overflow-hidden mb-4 border border-slate-800/50">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tag
                      size={60}
                      className="text-slate-800 group-hover:text-indigo-500/20 transition-colors duration-500"
                    />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-[10px] font-bold text-white shadow-xl">
                  {product.stock > 0
                    ? `${product.stock} DISPONIBLES`
                    : 'SIN STOCK'}
                </div>
              </div>

              <div className="px-5 pb-6 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xl font-black text-indigo-400">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 min-h-[40px]">
                  {product.description || 'Sin descripción detallada disponible.'}
                </p>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed"
                    disabled={product.stock <= 0}
                  >
                    <Plus size={16} /> AGREGAR
                  </button>
                  <button className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-colors">
                    <Info size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserView;