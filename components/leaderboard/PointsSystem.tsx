export const PointsSystem = () => (
  <div>
    <h3 className="font-bold mb-2">Points System</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Per Selection</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Exact position match: 3 points</li>
          <li>One position off: 2 points</li>
          <li>Two positions off: 1 point</li>
        </ul>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Maximum Points</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Men's selections: 9 points</li>
          <li>Women's selections: 9 points</li>
          <li>Total possible: 18 points</li>
        </ul>
      </div>
    </div>
  </div>
);
