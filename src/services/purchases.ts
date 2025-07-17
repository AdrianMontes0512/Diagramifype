import axios from 'axios';

export const API_PURCHASES = axios.create({
  baseURL: 'https://41x3ltcpra.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ProductItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Purchase {
  compra_id: string;
  user_id: string;
  products: ProductItem[];
  total: number;
  fecha: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface PurchaseRequest {
  token: string;
  tenant_id: string;
  user_id: string;
  products: ProductItem[];
  total: number;
}

// Registrar compra
export const RegistrarCompra = async (compra: PurchaseRequest): Promise<Purchase> => {
  try {
    console.log('Enviando compra:', compra);
    const response = await API_PURCHASES.post('/compras/registrar-compra', compra);
    console.log('Respuesta registrar compra:', response.data);
    
    // Manejar si la respuesta tiene el formato con body JSON string
    if (response.data && response.data.body) {
      const parsedBody = JSON.parse(response.data.body);
      return parsedBody;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al registrar compra:', error);
    throw error;
  }
};

export const ListarComprasUsuario = async (): Promise<Purchase[]> => {
  try {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    
    const params = new URLSearchParams({
      token: token || '',
      tenant_id: "inkafarma",
      user_id: user_id || ''
    });
    
    console.log('Listando compras con params:', { token, tenant_id: "inkafarma", user_id });
    const response = await API_PURCHASES.get(`/compras/listar-compras?${params}`);
    console.log('Respuesta listar compras:', response.data);
    
    // La respuesta es directamente un array de compras, pero necesitamos transformarla
    const purchases = Array.isArray(response.data) ? response.data : [];
    
    // Transformar la respuesta de la API al formato esperado por la interfaz
    return purchases.map((purchase: any) => ({
      compra_id: purchase.purchase_id,
      user_id: purchase.user_tenant?.split('#')[1] || user_id || '',
      products: purchase.products || [],
      total: purchase.total,
      fecha: purchase.createdAt,
      status: 'completed' as const // La API no devuelve status, asumimos completado
    }));
  } catch (error) {
    console.error('Error al listar compras:', error);
    throw error;
  }
};
