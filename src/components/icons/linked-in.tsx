import React from 'react';

const LinkedinLogoIcon = ({
  size = undefined,
  color = '#000000',
  strokeWidth = 2,
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}) => {
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = 24 + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        opacity,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path fill="currentColor" d="M13 1a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM9.675 5.85a2.2 2.2 0 0 0-1.096.231c-.257.129-.527.424-.734.938h-.053V6H6v6.005h1.906V8.812c-.027-.328.077-.75.291-1.002s.521-.312.753-.342h.072c.607 0 1.056.375 1.056 1.321v3.216h1.906L12 8.357c0-1.804-1.166-2.506-2.325-2.506M3.05 12h1.9V6h-1.9zM4 2.93a1.075 1.075 0 1 0 0 2.15a1.075 1.075 0 0 0 0-2.15"/>
    </svg>
  );
};

export default LinkedinLogoIcon;