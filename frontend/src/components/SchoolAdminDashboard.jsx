import React, { useState } from 'react';
import DataTable from './DataTable';
import UserModal from './UserModal';
import DeleteConfirmModal from './DeleteConfirmModal';

// Initial Tenant Data
const initialStudents = [
  { id: 1, name: 'John Doe', email: 'student.john@horizon-academy.edu', role: 'student', status: 'active', cohort: 'Grade 10 - Section A', created_at: '2026-09-15' },
  { id: 2, name: 'Emma Watson', email: 'e.watson@horizon-academy.edu', role: 'student', status: 'active', cohort: 'Grade 10 - Section A', created_at: '2026-09-16' },
  { id: 3, name: 'Lucas Scott', email: 'l.scott@horizon-academy.edu', role: 'student', status: 'inactive', cohort: 'Grade 11 - Advanced STEM', created_at: '2026-09-18' },
  { id: 4, name: 'Sophia Chen', email: 'sophia.c@horizon-academy.edu', role: 'student', status: 'active', cohort: 'Grade 11 - Advanced STEM', created_at: '2026-09-19' },
  { id: 5, name: 'Mateo Rossi', email: 'mateo.r@horizon-academy.edu', role: 'student', status: 'suspended', cohort: 'Grade 10 - Section A', created_at: '2026-09-20' },
  { id: 6, name: 'Aaliyah Patel', email: 'a.patel@horizon-academy.edu', role: 'student', status: 'active', cohort: 'Grade 12 - Pre-College', created_at: '2026-09-21' },
  { id: 7, name: 'Liam Davies', email: 'l.davies@horizon-academy.edu', role: 'student', status: 'active', cohort: 'Grade 12 - Pre-College', created_at: '2026-09-22' },
];

const initialProfessors = [
  { id: 10, name: 'Dr. Alan Turing', email: 'alan.turing@horizon-academy.edu', role: 'professor', status: 'active', specialization: 'Computer Science & Discrete Math', taught_subjects_count: 2, created_at: '2026-09-01' },
  { id: 11, name: 'Prof. Marie Curie', email: 'marie.curie@horizon-academy.edu', role: 'professor', status: 'active', specialization: 'Classical & Nuclear Physics', taught_subjects_count: 3, created_at: '2026-09-02' },
  { id: 12, name: 'Dr. Katherine Johnson', email: 'k.johnson@horizon-academy.edu', role: 'professor', status: 'active', specialization: 'Orbital Mechanics & Calculus', taught_subjects_count: 2, created_at: '2026-09-05' },
  { id: 13, name: 'Prof. Richard Feynman', email: 'r.feynman@horizon-academy.edu', role: 'professor', status: 'inactive', specialization: 'Quantum Electrodynamics', taught_subjects_count: 1, created_at: '2026-09-10' },
];

export default function SchoolAdminDashboard({ currentTab = 'overview', addToast }) {
  const [activeSubTab, setActiveSubTab] = useState(
    currentTab === 'professors' ? 'professors' : 'students'
  );

  const [students, setStudents] = useState(initialStudents);
  const [professors, setProfessors] = useState(initialProfessors);

  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'student', // 'student' | 'professor'
    initialData: null,
  });

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    user: null,
  });

  // Open Add modal
  const handleAddNew = (type) => {
    setModalState({
      isOpen: true,
      type,
      initialData: null,
    });
  };

  // Open Edit modal
  const handleEdit = (user) => {
    setModalState({
      isOpen: true,
      type: user.role === 'professor' ? 'professor' : 'student',
      initialData: user,
    });
  };

  // Submit Add or Edit
  const handleModalSubmit = (formData) => {
    const isProfessor = modalState.type === 'professor';

    if (modalState.initialData) {
      // UPDATE
      if (isProfessor) {
        setProfessors((prev) =>
          prev.map((item) => (item.id === formData.id ? { ...item, ...formData } : item))
        );
      } else {
        setStudents((prev) =>
          prev.map((item) => (item.id === formData.id ? { ...item, ...formData } : item))
        );
      }

      addToast({
        type: 'success',
        title: `${isProfessor ? 'Professor' : 'Student'} Updated`,
        message: `Changes for "${formData.name}" have been saved to the school database.`,
      });
    } else {
      // CREATE
      const newEntry = {
        ...formData,
        id: Date.now(),
        role: isProfessor ? 'professor' : 'student',
        created_at: new Date().toISOString().split('T')[0],
        taught_subjects_count: isProfessor ? 1 : undefined,
        cohort: !isProfessor ? 'Grade 10 - Section A' : undefined,
      };

      if (isProfessor) {
        setProfessors((prev) => [newEntry, ...prev]);
      } else {
        setStudents((prev) => [newEntry, ...prev]);
      }

      addToast({
        type: 'success',
        title: `New ${isProfessor ? 'Professor' : 'Student'} Enrolled`,
        message: `Account created for "${formData.name}" (${formData.email}). Password securely hashed.`,
      });
    }

    setModalState({ isOpen: false, type: 'student', initialData: null });
  };

  // Open Delete Confirm
  const handleDeleteClick = (user) => {
    setDeleteModalState({
      isOpen: true,
      user,
    });
  };

  // Confirm Delete
  const handleConfirmDelete = (id) => {
    const user = deleteModalState.user;
    if (user.role === 'professor') {
      setProfessors((prev) => prev.filter((p) => p.id !== id));
    } else {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }

    addToast({
      type: 'warning',
      title: `${user.role === 'professor' ? 'Professor' : 'Student'} Removed`,
      message: `"${user.name}" has been removed from this school tenant.`,
    });

    setDeleteModalState({ isOpen: false, user: null });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Students</span>
            <span className="text-lg">🎓</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{students.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">+12% this term</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tenant ID: #1 &bull; Active Cohorts</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Faculty &amp; Professors</span>
            <span className="text-lg">👨‍🏫</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{professors.length}</span>
            <span className="text-xs text-indigo-400 font-semibold">Full Staff</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Teaching across 14 subjects</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class Cohorts</span>
            <span className="text-lg">🏫</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">14</span>
            <span className="text-xs text-emerald-400 font-semibold">2026-2027</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Grades 9 through 12</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">School Subscription</span>
            <span className="text-lg">💳</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-emerald-400 capitalize">Active (Tier 2)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Stripe ID: cus_horizon_9941</p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'students'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🎓 Students Directory</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-950 text-indigo-300 text-[10px]">
              {students.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('professors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'professors'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>👨‍🏫 Professors &amp; Faculty</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-950 text-indigo-300 text-[10px]">
              {professors.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-400 hidden sm:block">
          Controller: <code className="text-indigo-300 bg-slate-900 px-2 py-0.5 rounded font-mono">SchoolAdminController</code>
        </div>
      </div>

      {/* Main Data Table */}
      {activeSubTab === 'students' ? (
        <DataTable
          title="Enrolled Students Management"
          roleType="student"
          data={students}
          onAddNew={() => handleAddNew('student')}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      ) : (
        <DataTable
          title="Faculty &amp; Professors Management"
          roleType="professor"
          data={professors}
          onAddNew={() => handleAddNew('professor')}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Modal for Add / Edit */}
      <UserModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: 'student', initialData: null })}
        onSubmit={handleModalSubmit}
        type={modalState.type}
        initialData={modalState.initialData}
      />

      {/* Modal for Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, user: null })}
        onConfirm={handleConfirmDelete}
        user={deleteModalState.user}
      />
    </div>
  );
}
