import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Product, ListarProductos, CrearProducto, CreateProductData, ActualizarProducto, EliminarProducto } from '../services/products';

interface ProductManagementProps {
  onModalChange?: (isOpen: boolean) => void;
}

// Componente Modal separado fuera del componente principal
const ProductModal = ({ 
  showModal, 
  editingProduct, 
  formData, 
  setFormData, 
  handleSubmit, 
  closeModal, 
  loading 
}: {
  showModal: boolean;
  editingProduct: Product | null;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  closeModal: () => void;
  loading: boolean;
}) => {
  if (!showModal) return null;

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300"
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200 transform transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95"
        style={{
          animation: 'slideInUp 0.4s ease-out'
        }}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-black hover:text-gray-700 p-1 transition-all duration-200 hover:scale-110"
        >
          <X size={24} />
        </button>
        <div className="text-center mb-6 animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <p className="text-gray-600 mt-2">
            {editingProduct ? 'Modifica la información del producto' : 'Añade un nuevo producto al catálogo'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          {editingProduct && (
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU (Código)</label>
              <input
                type="text"
                value={formData.sku}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Se genera automáticamente"
              />
              <p className="text-xs text-gray-500 mt-1">El SKU se genera automáticamente y no se puede modificar</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Ingrediente Activo</label>
            <input
              type="text"
              value={formData.activeIngredient}
              onChange={(e) => setFormData({...formData, activeIngredient: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Forma de Dosificación</label>
            <select
              value={formData.dosageForm}
              onChange={(e) => setFormData({...formData, dosageForm: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="tableta">Tableta</option>
              <option value="capsula">Cápsula</option>
              <option value="jarabe">Jarabe</option>
              <option value="suspension">Suspensión</option>
              <option value="solucion">Solución</option>
              <option value="crema">Crema</option>
              <option value="gel">Gel</option>
              <option value="pomada">Pomada</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio (S/)</label>
            <input
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="prescriptionRequired"
              checked={formData.prescriptionRequired}
              onChange={(e) => setFormData({...formData, prescriptionRequired: e.target.checked})}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="prescriptionRequired" className="ml-2 block text-sm text-gray-900">
              Requiere receta médica
            </label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default function ProductManagement({ onModalChange }: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    activeIngredient: '',
    dosageForm: '',
    precio: '',
    expirationDate: '',
    prescriptionRequired: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productList = await ListarProductos();
      setProducts(productList);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData: CreateProductData = {
        nombre: formData.nombre,
        activeIngredient: formData.activeIngredient,
        dosageForm: formData.dosageForm,
        precio: parseFloat(formData.precio),
        expirationDate: formData.expirationDate + 'T00:00:00Z', // Agregar formato ISO
        prescriptionRequired: formData.prescriptionRequired,
      };

      if (editingProduct) {
        // Actualizar producto existente
        const updatedProduct: Product = {
          ...editingProduct,
          sku: formData.sku || editingProduct.sku,
          nombre: formData.nombre,
          activeIngredient: formData.activeIngredient,
          dosageForm: formData.dosageForm,
          precio: parseFloat(formData.precio),
          expirationDate: formData.expirationDate + 'T00:00:00Z',
          prescriptionRequired: formData.prescriptionRequired,
        };
        await ActualizarProducto(updatedProduct);
        await loadProducts(); // Recargar la lista
      } else {
        await CrearProducto(productData);
        await loadProducts(); // Recargar la lista
      }
      
      resetForm();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto. Por favor revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      nombre: '',
      activeIngredient: '',
      dosageForm: '',
      precio: '',
      expirationDate: '',
      prescriptionRequired: false,
    });
    setEditingProduct(null);
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        sku: product.sku || '',
        nombre: product.nombre,
        activeIngredient: product.activeIngredient,
        dosageForm: product.dosageForm,
        precio: product.precio.toString(),
        expirationDate: product.expirationDate.split('T')[0], // Convertir a formato de input date
        prescriptionRequired: product.prescriptionRequired,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
    onModalChange?.(true);
  };

  const closeModal = () => {
    setShowModal(false);
    onModalChange?.(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  const handleDeleteProduct = async (product: Product) => {
    
    // Usar tenant_id fijo ya que es hardcodeado en ListarProductos
    const tenantId = product.tenant_id || "inkafarma";
    const productSku = product.sku || product.producto_id;
    
    
    if (!productSku) {
      alert('No se puede eliminar el producto: falta el SKU o ID del producto');
      return;
    }

    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el producto "${product.nombre}"?`
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      await EliminarProducto(tenantId, productSku);
      await loadProducts(); // Recargar la lista
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto. Por favor revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      
      {/* Contenido principal */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <button
            onClick={() => openModal()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* Lista de productos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando productos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingrediente Activo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Forma Dosificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={product.sku || product.producto_id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.activeIngredient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.dosageForm}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(product.precio)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.expirationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.prescriptionRequired 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.prescriptionRequired ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {products.length === 0 && !loading && (
                <div className="p-8 text-center text-gray-500">
                  No hay productos registrados
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal renderizado con portal */}
      <ProductModal
        showModal={showModal}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        loading={loading}
      />
    </>
  );
}
