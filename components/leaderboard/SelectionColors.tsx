export const SelectionColors = () => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-bold mb-2">Selection Colors</h3>
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center">
        <span className="inline-block w-4 h-4 bg-green-100 rounded mr-2"></span>
        <span>Exact position match (3 points)</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block w-4 h-4 bg-yellow-100 rounded mr-2"></span>
        <span>Right lifter, wrong position (1-2 points)</span>
      </div>
    </div>
  </div>
);
