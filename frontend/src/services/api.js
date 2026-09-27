const API_URL = import.meta.env.VITE_API_URL || ''

export const demoProducts = [
  { id: 'demo-1', name: 'Arc Desk Lamp', description: 'A sculptural light for focused work and slow evenings.', price: 129, stock_quantity: 14, category: 'Home', image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85' },
  { id: 'demo-2', name: 'Everyday Carry Tote', description: 'Roomy, durable canvas with considered details for daily rituals.', price: 84, stock_quantity: 22, category: 'Accessories', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85' },
  { id: 'demo-3', name: 'Studio Headphones', description: 'Immersive sound, soft-touch comfort, and a calm, clean silhouette.', price: 198, stock_quantity: 8, category: 'Technology', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85' },
  { id: 'demo-4', name: 'Form Ceramic Set', description: 'Hand-finished pieces that make everyday tables feel intentional.', price: 64, stock_quantity: 18, category: 'Home', image_url: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=85' },
  { id: 'demo-5', name: 'Field Notes Journal', description: 'A tactile notebook for ideas, lists, and the things worth keeping.', price: 28, stock_quantity: 45, category: 'Stationery', image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85' },
  { id: 'demo-6', name: 'Onda Glass Bottle', description: 'A reusable daily essential with a quiet, balanced profile.', price: 42, stock_quantity: 31, category: 'Wellness', image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85' },
]

async function request(path) {
  const response = await fetch(`${API_URL}/api/products${path}`)
  if (!response.ok) throw new Error(`Products service returned ${response.status}`)
  return response.json()
}

export async function getProducts() {
  const payload = await request('')
  return payload.data || []
}

export async function getProduct(id) {
  const payload = await request(`/${id}`)
  return payload.data
}
