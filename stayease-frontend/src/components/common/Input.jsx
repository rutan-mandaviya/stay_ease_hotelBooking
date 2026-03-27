import React from 'react';

const Input = ({ label, icon: Icon, register, name, error, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          {...register(name)}
          {...props}
          className={`w-full py-2.5 rounded-xl border bg-white transition-all outline-none focus:ring-2 focus:ring-primary/20
            ${Icon ? 'pl-10 pr-4' : 'px-4'}
            ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium ml-1">{error.message}</p>}
    </div>
  );
};

export default Input;