import { PresetCatalog } from '../types';

export const SAMPLE_CATALOGS: PresetCatalog[] = [
  {
    id: 'cs-sophomore',
    title: 'Computer Science Major (Fall Semester)',
    description: 'Core CS curriculum including Programming, Linear Algebra, Physics, Economics, and Academic Writing.',
    courses: [
      {
        id: 'c1',
        code: 'CS 101',
        title: 'Intro to Computer Science & Python',
        credits: 4,
        department: 'Computer Science',
        required: true,
        selected: true,
        sections: [
          {
            id: 'cs101-01',
            sectionId: 'Sec 01',
            courseCode: 'CS 101',
            courseTitle: 'Intro to Computer Science & Python',
            professor: 'Dr. Alan Turing',
            professorRating: 4.9,
            difficultyRating: 3.2,
            location: 'Turing Hall 101',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed', 'Fri'], startTime: '09:00', endTime: '10:15' }],
            color: 'indigo'
          },
          {
            id: 'cs101-02',
            sectionId: 'Sec 02',
            courseCode: 'CS 101',
            courseTitle: 'Intro to Computer Science & Python',
            professor: 'Prof. Grace Hopper',
            professorRating: 4.8,
            difficultyRating: 2.8,
            location: 'Science Center 302',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '13:00', endTime: '14:45' }],
            color: 'indigo'
          },
          {
            id: 'cs101-03',
            sectionId: 'Sec 03',
            courseCode: 'CS 101',
            courseTitle: 'Intro to Computer Science & Python',
            professor: 'Dr. Severus Snape',
            professorRating: 3.4,
            difficultyRating: 4.5,
            location: 'Basement Lab B4',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '15:30', endTime: '17:00' }],
            color: 'indigo'
          }
        ]
      },
      {
        id: 'c2',
        code: 'MATH 201',
        title: 'Linear Algebra & Applications',
        credits: 4,
        department: 'Mathematics',
        required: true,
        selected: true,
        sections: [
          {
            id: 'math201-01',
            sectionId: 'Sec 01',
            courseCode: 'MATH 201',
            courseTitle: 'Linear Algebra & Applications',
            professor: 'Dr. Katherine Johnson',
            professorRating: 4.9,
            difficultyRating: 3.0,
            location: 'Euler Hall 204',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed', 'Fri'], startTime: '10:30', endTime: '11:45' }],
            color: 'emerald'
          },
          {
            id: 'math201-02',
            sectionId: 'Sec 02',
            courseCode: 'MATH 201',
            courseTitle: 'Linear Algebra & Applications',
            professor: 'Prof. Carl Gauss',
            professorRating: 4.2,
            difficultyRating: 4.1,
            location: 'Euler Hall 105',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '10:00', endTime: '11:45' }],
            color: 'emerald'
          },
          {
            id: 'math201-03',
            sectionId: 'Sec 03',
            courseCode: 'MATH 201',
            courseTitle: 'Linear Algebra & Applications',
            professor: 'Dr. Terence Tao',
            professorRating: 4.7,
            difficultyRating: 3.8,
            location: 'Euler Hall 301',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '15:00', endTime: '16:45' }],
            color: 'emerald'
          }
        ]
      },
      {
        id: 'c3',
        code: 'PHYS 101',
        title: 'General Physics I: Mechanics',
        credits: 4,
        department: 'Physics',
        required: true,
        selected: true,
        sections: [
          {
            id: 'phys101-01',
            sectionId: 'Sec 01',
            courseCode: 'PHYS 101',
            courseTitle: 'General Physics I: Mechanics',
            professor: 'Dr. Richard Feynman',
            professorRating: 5.0,
            difficultyRating: 3.5,
            location: 'Physics Auditorium 1',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '13:00', endTime: '14:30' }],
            color: 'amber'
          },
          {
            id: 'phys101-02',
            sectionId: 'Sec 02',
            courseCode: 'PHYS 101',
            courseTitle: 'General Physics I: Mechanics',
            professor: 'Prof. Marie Curie',
            professorRating: 4.6,
            difficultyRating: 3.9,
            location: 'Curie Lab 201',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '08:30', endTime: '10:00' }],
            color: 'amber'
          },
          {
            id: 'phys101-03',
            sectionId: 'Sec 03',
            courseCode: 'PHYS 101',
            courseTitle: 'General Physics I: Mechanics',
            professor: 'Dr. Sheldon Cooper',
            professorRating: 3.1,
            difficultyRating: 4.8,
            location: 'Caltech Annex 102',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed', 'Fri'], startTime: '12:00', endTime: '13:15' }],
            color: 'amber'
          }
        ]
      },
      {
        id: 'c4',
        code: 'ECON 101',
        title: 'Principles of Microeconomics',
        credits: 3,
        department: 'Economics',
        required: false,
        selected: true,
        sections: [
          {
            id: 'econ101-01',
            sectionId: 'Sec 01',
            courseCode: 'ECON 101',
            courseTitle: 'Principles of Microeconomics',
            professor: 'Prof. Adam Smith',
            professorRating: 4.5,
            difficultyRating: 2.5,
            location: 'Business School 110',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '11:30', endTime: '12:45' }],
            color: 'rose'
          },
          {
            id: 'econ101-02',
            sectionId: 'Sec 02',
            courseCode: 'ECON 101',
            courseTitle: 'Principles of Microeconomics',
            professor: 'Dr. Janet Yellen',
            professorRating: 4.8,
            difficultyRating: 2.9,
            location: 'Finance Hall 402',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '14:30', endTime: '15:45' }],
            color: 'rose'
          },
          {
            id: 'econ101-03',
            sectionId: 'Sec 03',
            courseCode: 'ECON 101',
            courseTitle: 'Principles of Microeconomics',
            professor: 'Prof. John Keynes',
            professorRating: 4.1,
            difficultyRating: 3.3,
            location: 'Business School 205',
            status: 'Open',
            timeSlots: [{ days: ['Fri'], startTime: '13:00', endTime: '16:00' }],
            color: 'rose'
          }
        ]
      },
      {
        id: 'c5',
        code: 'ENG 110',
        title: 'Academic Writing & Critical Research',
        credits: 3,
        department: 'English',
        required: false,
        selected: true,
        sections: [
          {
            id: 'eng110-01',
            sectionId: 'Sec 01',
            courseCode: 'ENG 110',
            courseTitle: 'Academic Writing & Critical Research',
            professor: 'Prof. Maya Angelou',
            professorRating: 4.9,
            difficultyRating: 2.2,
            location: 'Humanities Hall 215',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '10:30', endTime: '11:45' }],
            color: 'violet'
          },
          {
            id: 'eng110-02',
            sectionId: 'Sec 02',
            courseCode: 'ENG 110',
            courseTitle: 'Academic Writing & Critical Research',
            professor: 'Dr. George Orwell',
            professorRating: 4.3,
            difficultyRating: 3.7,
            location: 'Humanities Hall 108',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '14:00', endTime: '15:15' }],
            color: 'violet'
          }
        ]
      }
    ]
  },
  {
    id: 'pre-med',
    title: 'Pre-Med & Biological Sciences',
    description: 'Rigorous pre-med trajectory covering Organic Chemistry, Cell Biology, Calculus, Ethics, and Psychology.',
    courses: [
      {
        id: 'pm1',
        code: 'CHEM 120',
        title: 'Organic Chemistry I + Lab',
        credits: 5,
        department: 'Chemistry',
        required: true,
        selected: true,
        sections: [
          {
            id: 'chem120-01',
            sectionId: 'Sec 01',
            courseCode: 'CHEM 120',
            courseTitle: 'Organic Chemistry I + Lab',
            professor: 'Dr. Rosalind Franklin',
            professorRating: 4.8,
            difficultyRating: 4.0,
            location: 'Chem Bldg 101',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed', 'Fri'], startTime: '09:00', endTime: '10:15' }],
            color: 'rose'
          },
          {
            id: 'chem120-02',
            sectionId: 'Sec 02',
            courseCode: 'CHEM 120',
            courseTitle: 'Organic Chemistry I + Lab',
            professor: 'Prof. Walter White',
            professorRating: 4.2,
            difficultyRating: 4.9,
            location: 'Chem Lab 3',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '11:00', endTime: '12:45' }],
            color: 'rose'
          }
        ]
      },
      {
        id: 'pm2',
        code: 'BIOL 150',
        title: 'Cellular & Molecular Biology',
        credits: 4,
        department: 'Biology',
        required: true,
        selected: true,
        sections: [
          {
            id: 'biol150-01',
            sectionId: 'Sec 01',
            courseCode: 'BIOL 150',
            courseTitle: 'Cellular & Molecular Biology',
            professor: 'Dr. Jane Goodall',
            professorRating: 4.9,
            difficultyRating: 3.1,
            location: 'Bio Auditorium',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '11:00', endTime: '12:30' }],
            color: 'emerald'
          },
          {
            id: 'biol150-02',
            sectionId: 'Sec 02',
            courseCode: 'BIOL 150',
            courseTitle: 'Cellular & Molecular Biology',
            professor: 'Prof. Gregor Mendel',
            professorRating: 4.4,
            difficultyRating: 3.5,
            location: 'Genetics Lab 2',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '14:00', endTime: '15:30' }],
            color: 'emerald'
          }
        ]
      },
      {
        id: 'pm3',
        code: 'PSYCH 101',
        title: 'Introduction to Psychology',
        credits: 3,
        department: 'Psychology',
        required: false,
        selected: true,
        sections: [
          {
            id: 'psych101-01',
            sectionId: 'Sec 01',
            courseCode: 'PSYCH 101',
            courseTitle: 'Introduction to Psychology',
            professor: 'Dr. Oliver Sacks',
            professorRating: 4.9,
            difficultyRating: 2.1,
            location: 'Behavioral Science 102',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '09:30', endTime: '10:45' }],
            color: 'amber'
          },
          {
            id: 'psych101-02',
            sectionId: 'Sec 02',
            courseCode: 'PSYCH 101',
            courseTitle: 'Introduction to Psychology',
            professor: 'Prof. Sigmund Freud',
            professorRating: 3.8,
            difficultyRating: 3.8,
            location: 'Mind Hall 204',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '14:00', endTime: '15:15' }],
            color: 'amber'
          }
        ]
      },
      {
        id: 'pm4',
        code: 'PHIL 105',
        title: 'Bioethics & Medical Humanities',
        credits: 3,
        department: 'Philosophy',
        required: false,
        selected: true,
        sections: [
          {
            id: 'phil105-01',
            sectionId: 'Sec 01',
            courseCode: 'PHIL 105',
            courseTitle: 'Bioethics & Medical Humanities',
            professor: 'Dr. Socrates',
            professorRating: 4.7,
            difficultyRating: 3.0,
            location: 'Agora Hall 12',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '15:30', endTime: '16:45' }],
            color: 'sky'
          },
          {
            id: 'phil105-02',
            sectionId: 'Sec 02',
            courseCode: 'PHIL 105',
            courseTitle: 'Bioethics & Medical Humanities',
            professor: 'Prof. Aristotle',
            professorRating: 4.6,
            difficultyRating: 3.2,
            location: 'Ethics Hall 301',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '16:00', endTime: '17:15' }],
            color: 'sky'
          }
        ]
      }
    ]
  },
  {
    id: 'business-arts',
    title: 'Business & Liberal Arts Hybrid',
    description: 'Accounting, Marketing, World History, Business Statistics, and Sociology.',
    courses: [
      {
        id: 'ba1',
        code: 'BUS 201',
        title: 'Financial Accounting',
        credits: 3,
        department: 'Business',
        required: true,
        selected: true,
        sections: [
          {
            id: 'bus201-01',
            sectionId: 'Sec 01',
            courseCode: 'BUS 201',
            courseTitle: 'Financial Accounting',
            professor: 'Prof. Warren Buffett',
            professorRating: 4.9,
            difficultyRating: 3.1,
            location: 'Wall Street Hall 101',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '10:00', endTime: '11:15' }],
            color: 'indigo'
          },
          {
            id: 'bus201-02',
            sectionId: 'Sec 02',
            courseCode: 'BUS 201',
            courseTitle: 'Financial Accounting',
            professor: 'Dr. Michael Bloomberg',
            professorRating: 4.5,
            difficultyRating: 3.5,
            location: 'Commerce Center 202',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '13:00', endTime: '14:15' }],
            color: 'indigo'
          }
        ]
      },
      {
        id: 'ba2',
        code: 'MKT 210',
        title: 'Marketing Principles & Digital Strategy',
        credits: 3,
        department: 'Marketing',
        required: true,
        selected: true,
        sections: [
          {
            id: 'mkt210-01',
            sectionId: 'Sec 01',
            courseCode: 'MKT 210',
            courseTitle: 'Marketing Principles & Digital Strategy',
            professor: 'Prof. Steve Jobs',
            professorRating: 4.9,
            difficultyRating: 2.8,
            location: 'Innovation Lab 1',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '10:00', endTime: '11:15' }],
            color: 'rose'
          },
          {
            id: 'mkt210-02',
            sectionId: 'Sec 02',
            courseCode: 'MKT 210',
            courseTitle: 'Marketing Principles & Digital Strategy',
            professor: 'Dr. Seth Godin',
            professorRating: 4.7,
            difficultyRating: 2.5,
            location: 'Design Studio B',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '13:00', endTime: '14:15' }],
            color: 'rose'
          }
        ]
      },
      {
        id: 'ba3',
        code: 'HIST 102',
        title: 'World Civilizations Since 1500',
        credits: 3,
        department: 'History',
        required: false,
        selected: true,
        sections: [
          {
            id: 'hist102-01',
            sectionId: 'Sec 01',
            courseCode: 'HIST 102',
            courseTitle: 'World Civilizations Since 1500',
            professor: 'Dr. Yuval Noah Harari',
            professorRating: 4.9,
            difficultyRating: 2.9,
            location: 'Heritage Center 301',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed', 'Fri'], startTime: '11:30', endTime: '12:30' }],
            color: 'amber'
          },
          {
            id: 'hist102-02',
            sectionId: 'Sec 02',
            courseCode: 'HIST 102',
            courseTitle: 'World Civilizations Since 1500',
            professor: 'Prof. Howard Zinn',
            professorRating: 4.6,
            difficultyRating: 3.1,
            location: 'History Bldg 104',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '15:00', endTime: '16:15' }],
            color: 'amber'
          }
        ]
      },
      {
        id: 'ba4',
        code: 'STAT 200',
        title: 'Applied Statistics for Business',
        credits: 4,
        department: 'Statistics',
        required: false,
        selected: true,
        sections: [
          {
            id: 'stat200-01',
            sectionId: 'Sec 01',
            courseCode: 'STAT 200',
            courseTitle: 'Applied Statistics for Business',
            professor: 'Dr. Nate Silver',
            professorRating: 4.8,
            difficultyRating: 3.4,
            location: 'Math Science 202',
            status: 'Open',
            timeSlots: [{ days: ['Mon', 'Wed'], startTime: '15:00', endTime: '16:30' }],
            color: 'teal'
          },
          {
            id: 'stat200-02',
            sectionId: 'Sec 02',
            courseCode: 'STAT 200',
            courseTitle: 'Applied Statistics for Business',
            professor: 'Prof. Thomas Bayes',
            professorRating: 4.1,
            difficultyRating: 4.0,
            location: 'Data Lab 101',
            status: 'Open',
            timeSlots: [{ days: ['Tue', 'Thu'], startTime: '08:30', endTime: '10:00' }],
            color: 'teal'
          }
        ]
      }
    ]
  }
];
