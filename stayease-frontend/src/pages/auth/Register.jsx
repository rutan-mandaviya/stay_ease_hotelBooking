import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, Phone, UserCheck } from 'lucide-react';
import { asyncRegister } from '../../store/actions/authActions';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
  const success = await dispatch(asyncRegister(data));
  
  if (success) {
   
    navigate('/login'); 
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-secondary mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join StayEase for a seamless experience</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" name="name" icon={User} register={register} error={errors.name} required />
          <Input label="Email" name="email" type="email" icon={Mail} register={register} error={errors.email} required />
          <Input label="Phone Number" name="phone" icon={Phone} register={register} />
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Account Type</label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                {...register('role')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="guest">Guest (I want to book rooms)</option>
                <option value="hotel_owner">Hotel Owner (I want to list hotels)</option>
              </select>
            </div>
          </div>

          <Input label="Password" name="password" type="password" icon={Lock} register={register} error={errors.password} required />

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;