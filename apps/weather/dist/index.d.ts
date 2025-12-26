import React from 'react';

interface WeatherProps {
    onClose: () => void;
}
declare const Weather: React.FC<WeatherProps>;

export { Weather as default };
