import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { asyncLogin } from '../../store/actions/authActions';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

 
  const onSubmit = async(data) => {
    const success = await dispatch(asyncLogin(data));
    if (success) {
      console.log("sucesss",success)
    navigate('/'); 
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to your StayEase account</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            placeholder="example@mail.com"
            register={register}
            error={errors.email}
            required="Email is required"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            register={register}
            error={errors.password}
            required="Password is required"
          />

          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Signing in...' : <><LogIn size={20} /> Login</>}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;