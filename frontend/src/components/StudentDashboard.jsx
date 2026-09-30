import React, { useState } from 'react';

const mockStudentData = {
  student: {
    name: 'John Doe',
    email: 'student.john@horizon-academy.edu',
    studentId: 'EDF-2026-8819',
    school: 'Horizon International Academy',
    cohort: 'Grade 10 - Section A',
    academicYear: '2026-2027',
    avatar: 'JD',
    gpa: '3.85 / 4.0',
    attendance: '96.2%',
  },
  enrolledSubjects: [
    {
      id: 1,
      name: 'Algebra & Geometry',
      code: 'MATH-101',
      professor: 'Dr. Alan Turing',
      professorEmail: 'alan.turing@horizon-academy.edu',
      currentGrade: 'A (92%)',
      schedule: 'Mon, Wed, Fri &bull; 09:00 - 10:30',
      credits: 4,
    },
    {
      id: 2,
      name: 'Classical Physics',
      code: 'PHYS-102',
      professor: 'Prof. Marie Curie',
      professorEmail: 'marie.curie@horizon-academy.edu',
      currentGrade: 'A- (89%)',
      schedule: 'Tue, Thu &bull; 11:00 - 12:30',
      credits: 4,
    },
    {
      id: 3,
      name: 'World History & Civilizations',
      code: 'HIST-105',
      professor: 'Dr. Katherine Johnson',
      professorEmail: 'k.johnson@horizon-academy.edu',
      currentGrade: 'A (94%)',
      schedule: 'Mon, Wed &bull; 14:00 - 15:30',
      credits: 3,
    },
    {
      id: 4,
      name: 'Literature & Composition',
      code: 'ENG-108',
      professor: 'Prof. Richard Feynman',
      professorEmail: 'r.feynman@horizon-academy.edu',
      currentGrade: 'B+ (87%)',
      schedule: 'Friday &bull; 13:00 - 15:00',
      credits: 3,
    },
  ],
  assignments: [
    { id: 1, title: 'Differential Geometry Problem Set #4', subject: 'MATH-101', due: 'In 2 Days (Oct 2)', status: 'Pending' },
    { id: 2, title: 'Thermodynamics Lab Report', subject: 'PHYS-102', due: 'In 5 Days (Oct 5)', status: 'In Progress' },
    { id: 3, title: 'Renaissance Essay Draft', subject: 'HIST-105', due: 'Completed', status: 'Submitted' },
  ],
};

export default function StudentDashboard({ addToast }) {
  const [submittedIds, setSubmittedIds] = useState([]);

  const handleSubmitAssignment = (assignment) => {
    setSubmittedIds((prev) => [...prev, assignment.id]);
    addToast({
      type: 'success',
      title: 'Assignment Submitted',
      message: `Your file for "${assignment.title}" has been uploaded to the professor portal.`,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/30 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-emerald-500/20 ring-2 ring-white/10">
            {mockStudentData.student.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{mockStudentData.student.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Student
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Class: <span className="text-white font-medium">{mockStudentData.student.cohort}</span> &bull; ID: <code className="text-emerald-300 font-mono">{mockStudentData.student.studentId}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-2xl font-black text-emerald-400">{mockStudentData.student.gpa}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cumulative GPA</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-white">{mockStudentData.student.attendance}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attendance</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-indigo-400">{mockStudentData.enrolledSubjects.length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Courses</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Enrolled Courses */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Enrolled Courses &amp; Professors</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                API: /api/student/dashboard
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockStudentData.enrolledSubjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {subject.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {subject.currentGrade}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">{subject.name}</h4>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 space-y-1 text-xs">
                    <p className="text-slate-400 flex items-center justify-between">
                      <span>Professor:</span>
                      <strong className="text-slate-200">{subject.professor}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">{subject.professorEmail}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 flex items-center justify-between">
                  <span dangerouslySetInnerHTML={{ __html: subject.schedule }}></span>
                  <span className="text-slate-500">{subject.credits} Credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Homework & Deadlines */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>📝</span> Assignments &amp; Homework
            </h4>

            <div className="space-y-3">
              {mockStudentData.assignments.map((item) => {
                const isSubmitted = submittedIds.includes(item.id) || item.status === 'Submitted';

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400">
                          {item.subject}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isSubmitted
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isSubmitted ? 'Submitted' : item.due}
                        </span>
                      </div>
                      <h5 className="font-semibold text-white mt-1">{item.title}</h5>
                    </div>

                    {!isSubmitted ? (
                      <button
                        onClick={() => handleSubmitAssignment(item)}
                        className="w-full mt-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow"
                      >
                        Upload Submission
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 text-center font-medium block">
                        ✓ Turned in for evaluation
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-800/30 p-5 rounded-2xl shadow-lg text-xs space-y-2">
            <h4 className="font-bold text-emerald-300">RBAC Security Note</h4>
            <p className="text-slate-300 leading-relaxed">
              Guarded by <code className="text-emerald-200 bg-slate-950 px-1 rounded">['auth:sanctum', 'role:student']</code>.
              Students have read-only access to their own cohort curricula and homework submissions, isolated from other schools and administrative routes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
