import { useState, useEffect } from 'react';

const ItemForm = ({ meta, onAdd }) => {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [colourType, setColourType] = useState('');
  const [colour, setColour] = useState('');
  const [areaTable, setAreaTable] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [length, setLength] = useState(0);
  const [area, setArea] = useState(0);
  const [price, setPrice] = useState(0);

  // Derived
  const selectedType = meta.types.find(t => t.key === type);
  const availableNames = selectedType?.names ?? [];
  const selectedName = availableNames.find(n => n.key === name);

  // Auto-fill areaTable when Name changes
  useEffect(() => {
    if (selectedName?.defaultArea > 0) {
      setAreaTable(selectedName.defaultArea);
    }
  }, [name, type]);

  // Recalculate area & price
  useEffect(() => {
    const newArea = length * quantity * areaTable;
    setArea(newArea);

    const rate = {
      PP: 0.11,
      BLACK: 0.08,
      BROWN: 0.08,
      GLOSSY: 0.09,
      MATTE: 0.09,
    }[colourType] ?? 0;

    setPrice(rate * newArea);
  }, [length, quantity, areaTable, colourType]);

  const handleChange = setter => e => {
    const val = e.target.value;
    setter(val === '' ? (setter === setAreaTable || setter === setLength ? 0 : '') : val);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!type || !name || !colourType || areaTable <= 0 || quantity <= 0 || length <= 0) {
      alert('Please fill all required fields');
      return;
    }

    onAdd({
      type,
      name,
      colourType,
      colour: colour.trim() || null,
      areaTable: parseFloat(areaTable),
      quantity: parseInt(quantity),
      length: parseFloat(length),
    });

    // Optional: Reset form
    // setType('');
    // setName('');
    // setColourType('');
    // setColour('');
    // setAreaTable(0);
    // setQuantity(1);
    // setLength(0);
    // setArea(0);
    // setPrice(0);
  };

  // Label text (same as placeholder)
  const getLabel = () => {
    if (!selectedName?.defaultArea) return 'Area Table';
    return `Area Table (Default: ₹${selectedName.defaultArea})`;
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={e => { setType(e.target.value); setName(''); }}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Type</option>
            {meta.types.map(t => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <select
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!type}
            required
          >
            <option value="">Select Name</option>
            {availableNames.map(n => (
              <option key={n.key} value={n.key}>{n.label}</option>
            ))}
          </select>
        </div>

        {/* Colour Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colour Type <span className="text-red-500">*</span>
          </label>
          <select
            value={colourType}
            onChange={handleChange(setColourType)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Colour Type</option>
            {meta.colours.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Custom Colour */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Colour
          </label>
          <input
            type="text"
            value={colour}
            onChange={handleChange(setColour)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Area Table */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getLabel()} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={areaTable}
            onChange={handleChange(setAreaTable)}
            min="0"
            step="0.01"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-yellow-50"
            required
          />
        </div>

        {/* Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Length <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={length}
            onChange={handleChange(setLength)}
            min="0"
            step="0.01"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={quantity}
            onChange={handleChange(setQuantity)}
            min="1"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

      </div>

      {/* Live Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium">
          Area: <span className="text-blue-600">{area.toFixed(2)} sq in</span>
        </p>
        <p className="text-sm font-medium">
          Price: <span className="text-green-600">₹{price.toFixed(2)}</span>
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Add Item
      </button>
    </form>
  );
};

export default ItemForm;