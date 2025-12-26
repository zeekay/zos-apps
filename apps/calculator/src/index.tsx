import React, { useState, useCallback } from 'react';

interface CalculatorProps {
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const percentage = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '×': return left * right;
      case '÷': return right !== 0 ? left / right : 0;
      default: return right;
    }
  };

  const equals = useCallback(() => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  }, [display, previousValue, operation]);

  const Button: React.FC<{
    label: string;
    onClick: () => void;
    className?: string;
    wide?: boolean;
  }> = ({ label, onClick, className = '', wide = false }) => (
    <button
      onClick={onClick}
      className={`
        ${wide ? 'col-span-2' : ''}
        h-14 rounded-full text-2xl font-light
        transition-all active:opacity-70
        ${className}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-black text-white select-none">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-6 pb-2">
        <span className="text-5xl font-light truncate">
          {display.length > 9 ? parseFloat(display).toExponential(4) : display}
        </span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3 p-4">
        <Button label="AC" onClick={clear} className="bg-gray-400 text-black" />
        <Button label="+/-" onClick={toggleSign} className="bg-gray-400 text-black" />
        <Button label="%" onClick={percentage} className="bg-gray-400 text-black" />
        <Button
          label="÷"
          onClick={() => performOperation('÷')}
          className={`bg-orange-500 ${operation === '÷' ? 'ring-2 ring-white' : ''}`}
        />

        <Button label="7" onClick={() => inputDigit('7')} className="bg-gray-700" />
        <Button label="8" onClick={() => inputDigit('8')} className="bg-gray-700" />
        <Button label="9" onClick={() => inputDigit('9')} className="bg-gray-700" />
        <Button
          label="×"
          onClick={() => performOperation('×')}
          className={`bg-orange-500 ${operation === '×' ? 'ring-2 ring-white' : ''}`}
        />

        <Button label="4" onClick={() => inputDigit('4')} className="bg-gray-700" />
        <Button label="5" onClick={() => inputDigit('5')} className="bg-gray-700" />
        <Button label="6" onClick={() => inputDigit('6')} className="bg-gray-700" />
        <Button
          label="-"
          onClick={() => performOperation('-')}
          className={`bg-orange-500 ${operation === '-' ? 'ring-2 ring-white' : ''}`}
        />

        <Button label="1" onClick={() => inputDigit('1')} className="bg-gray-700" />
        <Button label="2" onClick={() => inputDigit('2')} className="bg-gray-700" />
        <Button label="3" onClick={() => inputDigit('3')} className="bg-gray-700" />
        <Button
          label="+"
          onClick={() => performOperation('+')}
          className={`bg-orange-500 ${operation === '+' ? 'ring-2 ring-white' : ''}`}
        />

        <Button label="0" onClick={() => inputDigit('0')} className="bg-gray-700" wide />
        <Button label="." onClick={inputDecimal} className="bg-gray-700" />
        <Button label="=" onClick={equals} className="bg-orange-500" />
      </div>
    </div>
  );
};

export default Calculator;
