"use client";
import { useRouter, usePathname } from 'next/navigation';
import { Button, Box } from '@mui/material'; // Assuming you're using MUI for the button
import Link from 'next/link';

const HomePage = () => {
  const router = useRouter(); // useRouter hook for navigation
  const navigateToChart = () => {
    ; // usePathname hook to get the current path
    router.push('/ChartPage'); // Use the path to your ChartPage
  };
  const navigateToNewChart = () => {
    ; // usePathname hook to get the current path
    router.push('/NewChartPage'); // Use the path to your ChartPage
  };

  return (
    <div className="glabalContainer">
      <Box
            height={200}
            width={200}
            my={4}
            display="flex"
            alignItems="center"
            gap={4}
            p={2}
            sx={{ border: '2px solid grey' }}
      
      >
      <Button variant="contained" onClick={navigateToChart}>
        View Chart
      </Button>
      <Button variant="contained" onClick={navigateToNewChart}>
        View New Chart
      </Button>
      </Box>
    </div>

  );
};

export default HomePage;
