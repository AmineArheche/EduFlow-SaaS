import React, { useState, useEffect } from 'react';

export default function UserModal({ isOpen, onClose, onSubmit, type, initialData = null }) {
  const isEdit = !!initialData;
  const isProfessor = type === 'professor';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'active',
    specialization: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
        status: initialData.status || 'active',
        specialization: initialData.specialization || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        status: 'active',
        specialization: isProfessor ? 'Advanced STEM & Mathematics' : '',
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen, isProfessor]);

  // Real-time validation
  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Full name is required.';
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters.';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'Email address is required.';
      else if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
    }
    if (name === 'password') {
      if (!isEdit && !value) error = 'Password is required.';
      else if (value && value.length < 8) error = 'Password must be at least 8 characters.';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const passErr = validateField('password', formData.password);

    const newErrors = { name: nameErr, email: emailErr, password: passErr };
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });

    if (nameErr || emailErr || passErr) {
      return;
    }

    onSubmit({
      ...formData,
      id: initialData?.id,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition text-lg"
        >
          &times;
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <span className="text-xl">{isProfessor ? '👨‍🏫' : '🎓'}</span>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isEdit ? `Edit ${isProfessor ? 'Professor' : 'Student'}` : `Add New ${isProfessor ? 'Professor' : 'Student'}`}
            </h3>
            <p className="text-xs text-slate-400">Scoped strictly to current school tenant database</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={isProfessor ? 'e.g. Dr. Richard Feynman' : 'e.g. Alex Johnson'}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                touched.name && errors.name
                  ? 'border-rose-500/60 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-500'
              }`}
            />
            {touched.name && errors.name && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              School Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="user@horizon-academy.edu"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                touched.email && errors.email
                  ? 'border-rose-500/60 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-500'
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {isEdit ? 'Password (Leave blank to keep unchanged)' : 'Initial Password'} {!isEdit && <span className="text-rose-400">*</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={isEdit ? '••••••••' : 'Min 8 characters (hashed securely)'}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                touched.password && errors.password
                  ? 'border-rose-500/60 focus:ring-rose-500/40'
                  : 'border-slate-800 focus:ring-indigo-500/40 focus:border-indigo-500'
              }`}
            />
            {touched.password && errors.password && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>

          {/* Professor Specialization */}
          {isProfessor && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Academic Department / Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Theoretical Physics, Applied Calculus"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Account Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            >
              <option value="active">Active (Full Access)</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended (Blocked by RBAC)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              {isEdit ? 'Save Changes' : `Create ${isProfessor ? 'Professor' : 'Student'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
