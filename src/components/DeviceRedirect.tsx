'use client';

import { useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const MOBILE_BREAKPOINT = 768; // Matches Tailwind's md breakpoint

export default function DeviceRedirect({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const isMobilePath = pathname === '/mobile';

      if (isMobile && !isMobilePath && pathname === '/') {
        router.push('/mobile');
      } else if (!isMobile && isMobilePath) {
        router.push('/');
      }
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname, router]);

  return <>{children}</>;
}
