import { useState, useEffect } from 'react';

const ItemList = ({ items, meta, onUpdate, onDelete, handleDeleteAll }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!editingId) return;

    const selectedType = meta.types.find(t => t.key === editForm.type);
    const selectedName = selectedType?.names.find(n => n.key === editForm.name);

    if (editForm.type && !editForm.name) {
      setEditForm(prev => ({ ...prev, areaTable: 0 }));
      return;
    }

    if (selectedName?.defaultArea > 0) {
      setEditForm(prev => ({ ...prev, areaTable: selectedName.defaultArea }));
    }
  }, [editForm.type, editForm.name, editingId, meta]);

  const handleEdit = (item) => {
    setEditingId(item.id);
    const selectedType = meta.types.find(t => t.key === item.type);
    const selectedName = selectedType?.names.find(n => n.key === item.name);
    const defaultArea = selectedName?.defaultArea ?? 0;

    setEditForm({
      ...item,
      areaTable: item.areaTable ?? defaultArea,
    });
  };

  const handleEditChange = (field) => (e) => {
    const value = e.target.value;
    setEditForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'type' ? { name: '' } : {})
    }));
  };

  const calculateItemArea = (item) => {
    return (item.length * item.quantity * (item.areaTable || 0)).toFixed(2);
  };

  const calculateItemPrice = (item) => {
    const rate = {
      PP: 0.11,
      BLACK: 0.08,
      BROWN: 0.08,
      GLOSSY: 0.09,
      MATTE: 0.09,
    }[item.colourType] ?? 0;
    return (rate * item.length * item.quantity * (item.areaTable || 0)).toFixed(2);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    onUpdate(editingId, {
      ...editForm,
      areaTable: parseFloat(editForm.areaTable) || 0,
      quantity: parseInt(editForm.quantity) || 1,
      length: parseFloat(editForm.length) || 0,
    });
    setEditingId(null);
  };

  const getLabel = (list, key) => {
    const found = list.find(e => e.key === key);
    return found ? found.label : key;
  };

  return (
    <>
      {/* Header + Delete All */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Items</h2>
        {items.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Delete All ({items.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left min-w-[120px]">Type</th>
              <th className="p-3 text-left min-w-[130px]">Name</th>
              <th className="p-3 text-left min-w-[110px]">Colour Type</th>
              <th className="p-3 text-left min-w-[100px]">Colour</th>
              <th className="p-3 text-left min-w-[110px]">Area Table</th>
              <th className="p-3 text-left min-w-[100px]">Length</th>
              <th className="p-3 text-left min-w-[100px]">Quantity</th>
              <th className="p-3 text-left min-w-[100px]">Area</th>
              <th className="p-3 text-left min-w-[100px]">Price</th>
              <th className="p-3 text-left min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                {editingId === item.id ? (
                  <>
                    <td className="p-3 min-w-[120px]">
                      <select
                        value={editForm.type}
                        onChange={handleEditChange('type')}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Type</option>
                        {meta.types.map(t => (
                          <option key={t.key} value={t.key}>{t.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 min-w-[130px]">
                      <select
                        value={editForm.name}
                        onChange={handleEditChange('name')}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                        disabled={!editForm.type}
                      >
                        <option value="">Select Name</option>
                        {meta.types.find(t => t.key === editForm.type)?.names.map(n => (
                          <option key={n.key} value={n.key}>{n.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 min-w-[110px]">
                      <select
                        value={editForm.colourType}
                        onChange={handleEditChange('colourType')}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        {meta.colours.map(c => (
                          <option key={c.key} value={c.key}>{c.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 min-w-[100px]">
                      <input
                        type="text"
                        value={editForm.colour || ''}
                        onChange={handleEditChange('colour')}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. RAL 9010"
                      />
                    </td>
                    <td className="p-3 min-w-[110px]">
                      <input
                        type="number"
                        value={editForm.areaTable}
                        onChange={handleEditChange('areaTable')}
                        className="w-full p-2 border rounded text-sm font-medium bg-yellow-50 focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="p-3 min-w-[100px]">
                      <input
                        type="number"
                        value={editForm.length}
                        onChange={handleEditChange('length')}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="p-3 min-w-[100px]">
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={handleEditChange('quantity')}
                        className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </td>
                    <td className="p-3 min-w-[100px] font-medium">
                      {calculateItemArea(editForm)}
                    </td>
                    <td className="p-3 min-w-[100px] font-medium text-green-600">
                      ₹{calculateItemPrice(editForm)}
                    </td>
                    <td className="p-3 min-w-[140px] text-center space-x-1">
                      <button
                        onClick={handleUpdateSubmit}
                        className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{getLabel(meta.types, item.type)}</td>
                    <td className="p-3">{getLabel(meta.types.find(t => t.key === item.type)?.names || [], item.name)}</td>
                    <td className="p-3">{getLabel(meta.colours, item.colourType)}</td>
                    <td className="p-3">{item.colour || '-'}</td>
                    <td className="p-3 font-medium">{item.areaTable}</td>
                    <td className="p-3">{item.length}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 font-medium">{calculateItemArea(item)}</td>
                    <td className="p-3 font-medium text-green-600">₹{calculateItemPrice(item)}</td>
                    <td className="p-3 text-center space-x-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ItemList;