import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Package, Plus, MapPin } from 'lucide-react';

export function InventoryManagement() {
  const { user } = useAuth();
  const { samples } = useData();

  const distributorSamples = useMemo(
    () => samples.filter((s) => s.userId === user?.id),
    [samples, user?.id]
  );

  // Group by product SKU
  const inventory = useMemo(() => {
    const grouped: Record<string, { total: number; items: typeof distributorSamples }> = {};
    distributorSamples.forEach((sample) => {
      if (!grouped[sample.productSKU]) {
        grouped[sample.productSKU] = { total: 0, items: [] };
      }
      grouped[sample.productSKU].total += sample.quantity;
      grouped[sample.productSKU].items.push(sample);
    });
    return grouped;
  }, [distributorSamples]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-1">Track your sample distributions</p>
        </div>
      </div>

      {Object.keys(inventory).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold text-gray-600 mb-2">
            No Inventory Found
          </p>
          <p className="text-gray-500">
            Start distributing samples to see your inventory here
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(inventory).map(([sku, data]) => (
            <div
              key={sku}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{sku}</h3>
                  <p className="text-sm text-gray-500">
                    {data.items.length} distribution{data.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Quantity</span>
                  <span className="text-lg font-bold text-gray-800">
                    {data.total} kg
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Recent Distributions:
                </p>
                <div className="space-y-2">
                  {data.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="text-gray-800">{item.recipientName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location.address?.split(',')[0]}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-700">
                        {item.quantity}kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
