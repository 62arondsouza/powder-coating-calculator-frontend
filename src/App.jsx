import { useEffect, useState } from 'react';
import axios from 'axios';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';

function App() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [meta, setMeta] = useState({ types: [], colours: [] });
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalArea, setTotalArea] = useState(0);

  useEffect(() => {
    fetchMeta();
    fetchItems();
  }, []);

  const fetchMeta = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/meta`);
      setMeta(response.data);
    } catch (error) {
      console.error('Error fetching meta:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/items`);
      setItems(response.data);
      calculateTotalArea(response.data);
      calculateTotalPrice(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async (item) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/items`, item);
      fetchItems(); // Refetch to update list and total
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateItem = async (id, item) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/items/${id}`, item);
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Delete ALL items? This cannot be undone.')) return;

    try {
      await fetch(`${BASE_URL}/api/items`, { method: 'DELETE' });
      setItems([]); // Clear UI
      setTotalArea(0);
      setTotalPrice(0);
    } catch (err) {
      alert('Failed to delete all items');
    }
  };

  const calculateTotalPrice = async (currentItems) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/calculate/final-price`, currentItems);
      setTotalPrice(response.data);
    } catch (error) {
      console.error('Error calculating total:', error);
      setTotalPrice(0);
    }
  };

  const calculateTotalArea = async (currentItems) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/calculate/total-area`, currentItems);
      setTotalArea(response.data);
    } catch(error) {
      console.error('Error calculating total area:', error);
      setTotalArea(0);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Powder Coating Calculator</h1>
      <ItemForm meta={meta} onAdd={addItem} />
      <ItemList items={items} meta={meta} onUpdate={updateItem} onDelete={deleteItem} handleDeleteAll={handleDeleteAll} />
      <div className="mt-4 text-xl font-bold">

        <p>Total Area: {totalArea.toFixed(2)} sq in</p>
        <p>Total Price: ₹{totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default App;