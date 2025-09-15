import React, { useCallback } from 'react';

export const colorSelector = {
  "Purple": "#8434E1",
  "Black": "#252525",
  "White": "#FFFFFF",
  "Gray": "#808080",
  "Blue": "#ADD8E6",
  "Red": "#FF0000",
  "Orange": "#FFA500",
  "Navy": "#000080",
  "Grey": "#808080",
  "Yellow": "#FFFF00",
  "Pink": "#FFC0CB",
  "Green": "#3A5F0B"
};

const ColorsFilter = ({ colors = [], appliedColors, setAppliedColors }) => {
  const onClickDiv = useCallback(
    (item) => {
      if (appliedColors.includes(item)) {
        setAppliedColors(appliedColors.filter(color => color !== item));
      } else {
        setAppliedColors([...appliedColors, item]);
      }
    },
    [appliedColors, setAppliedColors]
  );

  return (
    <div className='flex flex-col mb-4'>
      <p className='text-[16px] text-black mt-5 mb-5'>Colors</p>
      <div className='flex flex-wrap px-2'>
        {colors.length === 0 && (
          <p className="text-gray-400 text-sm">No colors available</p>
        )}
        {colors.map(item => (
          <div key={item} className='flex flex-col items-center mr-4 mb-3'>
            <div
              className='w-8 h-8 border rounded-xl cursor-pointer hover:scale-110 transition-transform'
              onClick={() => onClickDiv(item)}
              style={{
                background: colorSelector[item] || item, // si non trouvé dans colorSelector, on utilise la valeur brute (ex: code hex du backend)
                borderColor: appliedColors.includes(item) ? 'black' : 'transparent',
                borderWidth: 2
              }}
            ></div>
            <p
              className='text-sm text-gray-400 mt-1'
              style={{ color: appliedColors.includes(item) ? 'black' : '' }}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorsFilter;
