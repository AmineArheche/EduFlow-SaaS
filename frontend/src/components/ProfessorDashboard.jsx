import React, { useState } from 'react';

const mockProfessorData = {
  professor: {
    name: 'Dr. Alan Turing',
    email: 'alan.turing@horizon-academy.edu',
    department: 'Computer Science & Mathematics',
    school: 'Horizon International Academy',
    avatar: 'AT',
  },
  stats: {
    assignedSubjects: 3,
    activeClasses: 2,
    totalStudents: 58,
    averageGrade: '87.4%',
  },
  subjects: [
    {
      id: 1,
      name: 'Algebra & Geometry',
      code: 'MATH-101',
      classCohort: 'Grade 10 - Section A',
      studentsCount: 28,
      nextSession: 'Tomorrow, 09:00 AM',
      room: 'Lecture Hall B',
      syllabusProgress: 68,
      students: [
        { id: 1, name: 'John Doe', grade: '92%', attendance: '96%', status: 'Excellent' },
        { id: 2, name: 'Emma Watson', grade: '88%', attendance: '92%', status: 'Good' },
        { id: 5, name: 'Mateo Rossi', grade: '74%', attendance: '80%', status: 'Needs Review' },
      ],
    },
    {
      id: 2,
      name: 'Differential Calculus & Algorithms',
      code: 'CS-204',
      classCohort: 'Grade 11 - Advanced STEM',
      studentsCount: 30,
      nextSession: 'Thursday, 11:30 AM',
      room: 'Computer Lab 3',
      syllabusProgress: 45,
      students: [
        { id: 3, name: 'Lucas Scott', grade: '95%', attendance: '98%', status: 'Top Performer' },
        { id: 4, name: 'Sophia Chen', grade: '89%', attendance: '94%', status: 'Good' },
      ],
    },
  ],
  upcomingExams: [
    { title: 'Calculus Mid-Term Exam', date: 'Oct 14, 2026', time: '10:00 AM - 12:00 PM', class: 'Grade 11 STEM' },
    { title: 'Geometry Quiz #3', date: 'Oct 18, 2026', time: '09:00 AM - 10:00 AM', class: 'Grade 10 Section A' },
  ],
};

export default function ProfessorDashboard({ addToast }) {
  const [selectedSubject, setSelectedSubject] = useState(mockProfessorData.subjects[0]);
  const [gradeUpdated, setGradeUpdated] = useState(false);

  const handlePostGrade = () => {
    setGradeUpdated(true);
    addToast({
      type: 'success',
      title: 'Grades Submitted',
      message: `Updated academic evaluations for ${selectedSubject.name} (${selectedSubject.classCohort}).`,
    });
    setTimeout(() => setGradeUpdated(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Professor Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-cyan-500/20 ring-2 ring-white/10">
            {mockProfessorData.professor.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{mockProfessorData.professor.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                Faculty Professor
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {mockProfessorData.professor.department} &bull; <span className="text-indigo-300">{mockProfessorData.professor.school}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-2xl font-black text-white">{mockProfessorData.stats.assignedSubjects}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Subjects</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-cyan-400">{mockProfessorData.stats.totalStudents}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Students</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-emerald-400">{mockProfessorData.stats.averageGrade}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Class Avg</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Assigned Subjects & Student Roster */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Courses &amp; Subjects Taught</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                API: /api/professor/dashboard
              </span>
            </h3>
          </div>

          {/* Subject Switcher Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockProfessorData.subjects.map((sub) => {
              const isSelected = selectedSubject.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub)}
                  className={`text-left p-4 rounded-xl border transition relative overflow-hidden ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
                      {sub.code}
                    </span>
                    <span className="text-xs text-slate-400">{sub.classCohort}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{sub.name}</h4>
                  
                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex justify-between text-[11px]">
                      <span>Next: {sub.nextSession}</span>
                      <span className="text-slate-300 font-medium">{sub.room}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${sub.syllabusProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 block text-right">
                      {sub.syllabusProgress}% Syllabus Completed
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Student Roster for Selected Subject */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Student Gradebook: {selectedSubject.name}
                </h4>
                <p className="text-xs text-slate-400">Cohort: {selectedSubject.classCohort}</p>
              </div>

              <button
                onClick={handlePostGrade}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition shadow-md shadow-cyan-600/30"
              >
                {gradeUpdated ? '✓ Submitted' : 'Update Evaluations'}
              </button>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-5">Student</th>
                  <th className="py-3 px-5">Average Score</th>
                  <th className="py-3 px-5">Attendance</th>
                  <th className="py-3 px-5 text-right">Academic Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedSubject.students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-5 font-bold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center justify-center font-bold text-[11px]">
                        {st.name.charAt(0)}
                      </span>
                      <span>{st.name}</span>
                    </td>
                    <td className="py-3 px-5 font-mono text-cyan-300 font-semibold">{st.grade}</td>
                    <td className="py-3 px-5 text-slate-300">{st.attendance}</td>
                    <td className="py-3 px-5 text-right">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Upcoming Exams & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>📅</span> Upcoming Exams &amp; Quizzes
            </h4>
            <div className="space-y-3">
              {mockProfessorData.upcomingExams.map((exam, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{exam.title}</span>
                  </div>
                  <p className="text-[11px] text-cyan-400 font-mono">{exam.date} &bull; {exam.time}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{exam.class}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-950/20 to-slate-900 border border-cyan-800/30 p-5 rounded-2xl shadow-lg text-xs space-y-3">
            <h4 className="font-bold text-cyan-300">RBAC Enforcement Note</h4>
            <p className="text-slate-300 leading-relaxed">
              This dashboard is guarded by <code className="text-cyan-200 bg-slate-950 px-1 rounded">['auth:sanctum', 'role:professor']</code>.
              Professor accounts can only view classes and students assigned to their specific course subjects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
