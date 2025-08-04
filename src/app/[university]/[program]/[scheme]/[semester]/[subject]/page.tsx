import { notFound } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { SyllabusSummary } from './_components/SyllabusSummary';
import { CourseModules } from './_components/CourseModules';
import ErrorDisplay from '@/components/common/ErrorDisplay'; 
import { AnimatedDiv } from '@/components/common/AnimatedDiv';
import { Footer } from '@/components/common/Footer';

interface SubjectPageProps {
  params: Promise<{
    university: string;
    program: string;
    scheme: string;
    semester: string;
    subject: string;
  }>;
}

interface DirectoryStructure {
  [key: string]: any;
}

async function getDirectoryStructure(): Promise<DirectoryStructure> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/universities`, {
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error('Failed to fetch universities data');
  }

  return res.json();
}

function findDataPath(directoryStructure: DirectoryStructure, resolvedParams: {
    university: string;
    program: string;
    scheme: string;
    semester: string;
    subject: string;
}): { university: any, program: any, scheme: any, semester: any, subject: any } | null {
    const { university: universityId, program: programId, scheme: schemeId, semester: semesterId, subject: subjectId } = resolvedParams;

    const university = { id: universityId, name: capitalizeWords(universityId) };
    const universityData = directoryStructure[universityId];
    if (!universityData) return null;

    const program = { id: programId, name: capitalizeWords(programId) };
    const programData = universityData[programId];
    if (!programData) return null;


    const scheme = { id: schemeId, name: capitalizeWords(schemeId) };
     const schemeData = programData[schemeId];
    if (!schemeData) return null;


    const semester = { id: semesterId, name: formatSemesterName(semesterId), subjects: Array.isArray(schemeData[semesterId]?.subjects) ? schemeData[semesterId].subjects : [] };
    if (!schemeData[semesterId]) return null;

    const subject = semester.subjects.find((sub: any) => sub.id === subjectId);
     if (!subject) return null;

    return { university, program, scheme, semester, subject };

}


function capitalizeWords(str: string | undefined): string {
    if (!str) return '';
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatSemesterName(semesterId: string): string {
    if (!semesterId) return '';
    return `Semester ${semesterId.replace('s', '').replace(/^0+/, '')}`;
}


export default async function SubjectPage({ params }: SubjectPageProps) {
  const resolvedParams = await params;
  let directoryStructure: DirectoryStructure | null = null;
  let error: string | null = null;

  try {
    directoryStructure = await getDirectoryStructure();
  } catch (e: any) {
    console.error('Error fetching directory structure:', e);
     error = 'Failed to load syllabus data.';
  }

  if (error || !directoryStructure) {
      return <ErrorDisplay errorMessage={error || 'Could not fetch directory structure.'} />;
  }


  const dataPath = findDataPath(directoryStructure, resolvedParams);

  if (!dataPath) {
    notFound();
  }

  const { university, program, scheme, semester, subject } = dataPath;


  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: university.name, href: `/select?university=${university.id}` },
    { label: program.name, href: `/select?university=${university.id}&program=${program.id}` },
    { label: scheme.name, href: `/select?university=${university.id}&program=${program.id}&scheme=${scheme.id}` },
    { label: semester.name, href: `/${university.id}/${program.id}/${scheme.id}/${semester.id}` },
    { label: subject.name },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <AnimatedDiv>
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="mt-8 mb-12">
              <h1 className="text-3xl font-bold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{subject.name}</h1>
              <p className="text-muted-foreground mt-2 text-lg">{subject.code}</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Course Modules</h2>
                <CourseModules subjectId={subject.id} modules={subject.modules || []} />
              </div>
              <aside className="space-y-8 lg:sticky lg:top-24 self-start">
                <h2 className="text-2xl font-bold">AI-Powered Tools</h2>
                <SyllabusSummary fullSyllabus={subject.fullSyllabus || ''} />
              </aside>
            </div>
          </div>
        </AnimatedDiv>
      </main>
      <Footer />
    </div>
  );
}
