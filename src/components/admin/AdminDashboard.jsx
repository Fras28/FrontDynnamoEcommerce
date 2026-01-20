import React, { useState, useEffect } from 'react';
import { 
  Loader2, PackagePlus, Tag, BarChart3, Edit3, X, Save, Trash2
} from 'lucide-react';
import CloudinaryUploader from './CloudinaryUploader';

const AdminDashboard = ({ token, setGlobalResponse }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({ 
    name: '', description: '', price: 0, stock: 0, imageUrl: '' 
  });

  const getApiUrl = () => {
    try {
      const viteEnv = typeof import.meta !== 'undefined' && import.meta.env 
        ? import.meta.env.VITE_API_BASE 
        : null;
      
      return viteEnv || 'http://localhost:3000';
    } catch (e) {
      return 'http://localhost:3000';
    }
  };

  const API_URL = getApiUrl();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error("Error al obtener productos");
    }
  };

  const handleInputChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleImageUploaded = (imageUrl) => {
    setProductForm({ ...productForm, imageUrl: imageUrl || '' });
  };

  const resetForm = () => {
    setProductForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
    setEditingId(null);
  };

  const handleSaveProduct = async () => {
    setLoading(true);
    
    const isEditing = !!editingId;
    const url = isEditing 
      ? `${API_URL}/products/${editingId}` 
      : `${API_URL}/products`;
    
    const method = isEditing ? 'PATCH' : 'POST';
  
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock, 10),
          imageUrl: productForm.imageUrl || null
        }),
      });
  
      const data = await res.json();
      setGlobalResponse({ status: res.status, data });
  
      if (res.ok) {
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      setGlobalResponse({ status: 'ERROR', data: { message: 'Error en la operación' } });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setGlobalResponse({ status: 204, data: { message: 'Eliminado correctamente' } });
        fetchProducts();
      } else {
        const data = await res.json();
        setGlobalResponse({ status: res.status, data });
      }
    } catch (error) {
      console.error("Error al eliminar");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Formulario de Gestión */}
      <div className="lg:col-span-5">
        <div className={`bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl transition-all ${
          editingId ? 'border-t-4 border-t-indigo-500' : 'border-t-4 border-t-amber-500'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              {editingId ? <Edit3 className="text-indigo-400" /> : <PackagePlus className="text-amber-400" />}
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Uploader de Imagen */}
            <CloudinaryUploader 
              currentImage={productForm.imageUrl}
              onImageUploaded={handleImageUploaded}
            />

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Nombre</label>
              <input 
                name="name" 
                placeholder="Ej: Monitor 4K" 
                value={productForm.name} 
                onChange={handleInputChange} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black" 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Descripción</label>
              <textarea 
                name="description" 
                placeholder="Detalles técnicos..." 
                value={productForm.description} 
                onChange={handleInputChange} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none text-black" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Precio ($)</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={productForm.price} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black" 
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Stock</label>
                <input 
                  name="stock" 
                  type="number" 
                  placeholder="0" 
                  value={productForm.stock} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-black" 
                  required 
                />
              </div>
            </div>

            <button 
              onClick={handleSaveProduct}
              className={`w-full py-4 rounded-2xl font-black text-slate-950 transition-all flex justify-center items-center gap-2 ${
                editingId 
                  ? 'bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20' 
                  : 'bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : (editingId ? <><Save size={18}/> ACTUALIZAR</> : 'GUARDAR PRODUCTO')}
            </button>
          </div>
        </div>
      </div>

      {/* Listado de Inventario */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="font-black flex items-center gap-2 px-2 text-white uppercase tracking-widest text-xs">
          <BarChart3 size={18} className="text-indigo-400" /> Control de Inventario
        </h3>
        
        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-2">
          {products.length === 0 && (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 p-12 rounded-[2rem] text-center">
              <p className="text-slate-500 text-sm italic">No hay productos en el catálogo</p>
            </div>
          )}
          
          {products.map(p => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-700 transition-all group shadow-lg">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="bg-slate-950 w-20 h-20 rounded-2xl border border-slate-800 overflow-hidden flex-shrink-0">
                    {p.imageUrl ? (
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag size={24} className="text-slate-700" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors truncate">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 font-black">ID: #{p.id}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEditClick(p)} className="p-2.5 hover:bg-indigo-500/10 text-indigo-400 rounded-xl transition-all" title="Editar">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="p-2.5 hover:bg-red-500/10 text-red-400 rounded-xl transition-all" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-800/50">
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Precio</p>
                  <p className="text-base font-black text-white">${Number(p.price).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Stock</p>
                  <p className={`text-sm font-bold ${p.stock < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {p.stock} uds.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Registro</p>
                  <p className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;