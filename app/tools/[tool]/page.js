'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HomePage from '../../page';

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const tool = params.tool;

  // Valid tool IDs
  const validTools = [
    'risk-factors-analysis',
    'progression-calculator',
    'axial-length-estimation',
    'vision-simulator',
    'cl-rx-vertex-calculator'
  ];

  useEffect(() => {
    // If invalid tool, redirect to home
    if (!validTools.includes(tool)) {
      router.push('/');
    }
  }, [tool, router]);

  // Render the HomePage component - it will detect the URL and open the correct tool
  return <HomePage />;
}
