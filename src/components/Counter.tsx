type CounterProps = {
  value: number;
  extraIncrementCount?: boolean;
  extraIncrementAmount?: number;
  setValue: (value: number) => void;
};

export const Counter = (props: CounterProps) => {
  const { value, extraIncrementCount, extraIncrementAmount, setValue } = props;

  return (
    <div className="flex flex-col items-center justify-between m-2">
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 text-white rounded"
          onClick={() => setValue(value + 1)}
        >
          +1
        </button>
        {extraIncrementCount && extraIncrementAmount && (
          <>
            <button
              className="px-2 py-1 text-white rounded"
              onClick={() => setValue(value + extraIncrementAmount)}
            >
              +{extraIncrementAmount}
            </button>
            <button
              className="px-2 py-1 text-white rounded"
              onClick={() => setValue(value + extraIncrementAmount * 2)}
            >
              +{extraIncrementAmount * 2}
            </button>
          </>
        )}
      </div>
      <div className="text-4xl m-4">{value}</div>
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 text-white rounded"
          onClick={() => setValue(value - 1)}
        >
          -1
        </button>
        {extraIncrementCount && extraIncrementAmount && (
          <>
            <button
              className="px-2 py-1 text-white rounded"
              onClick={() => setValue(value - extraIncrementAmount)}
            >
              -{extraIncrementAmount}
            </button>
            <button
              className="px-2 py-1 text-white rounded"
              onClick={() => setValue(value - extraIncrementAmount * 2)}
            >
              -{extraIncrementAmount * 2}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
