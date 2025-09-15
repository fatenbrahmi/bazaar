import React, { useCallback } from 'react';

const SizeFilter = ({ sizes, appliedSizes, setAppliedSizes }) => {
  const onClickSize = useCallback((size) => {
    if (appliedSizes.includes(size)) {
      setAppliedSizes(appliedSizes.filter(s => s !== size));
    } else {
      setAppliedSizes([...appliedSizes, size]);
    }
  }, [appliedSizes, setAppliedSizes]);

  return (
    <div className="flex flex-col mb-4">
      <p className="text-[16px] text-black mt-5 mb-5">Sizes</p>

      {(!sizes || sizes.length === 0) ? (
        <p className="text-gray-400">No sizes available</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <div
              key={size}
              className={`px-3 py-1 border rounded cursor-pointer ${
                appliedSizes.includes(size)
                  ? 'border-black bg-gray-200'
                  : 'border-gray-300'
              }`}
              onClick={() => onClickSize(size)}
            >
              {size}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeFilter;
