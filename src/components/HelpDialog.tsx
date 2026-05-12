// src/components/HelpDialog.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' aria-label='Help'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='10' />
            <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
            <path d='M12 17h.01' />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[85dvh] overflow-y-auto pt-16 pb-8 sm:max-h-[80dvh]'>
        <DialogHeader>
          <DialogTitle>How to Use Guide</DialogTitle>
          <DialogDescription>This guide introduces the basic usage of this template.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <h4 className='font-medium'>🚀 Quick Start</h4>
            <ul className='list-disc space-y-1 pl-5'>
              <li>
                Clone the repository
                <code className='bg-muted ml-2 rounded px-1.5 py-0.5 text-sm'>git clone [repository-url]</code>
              </li>
              <li>
                Install dependencies
                <code className='bg-muted ml-2 rounded px-1.5 py-0.5 text-sm'>npm install</code>
              </li>
              <li>
                Start development server
                <code className='bg-muted ml-2 rounded px-1.5 py-0.5 text-sm'>npm run dev</code>
              </li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>⚡️ Main Features</h4>
            <ul className='list-disc space-y-1 pl-5'>
              <li>
                <em>Astro v5</em>: Fast builds and excellent performance
                <span className='text-muted-foreground ml-2 block text-sm'>
                  Supports static site generation and island architecture
                </span>
              </li>
              <li>
                <em>TailwindCSS v4</em>: The latest utility-first CSS
                <span className='text-muted-foreground ml-2 block text-sm'>
                  Supports custom properties and modern syntax
                </span>
              </li>
              <li>
                <em>shadcn/ui</em>: Customizable UI components
                <span className='text-muted-foreground ml-2 block text-sm'>
                  Various components like Button, Dialog, Card are available
                </span>
              </li>
              <li>
                <em>Dark mode</em>: Synced with system settings
                <span className='text-muted-foreground ml-2 block text-sm'>
                  Automatic switching via CSS custom properties
                </span>
              </li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>🔧 Environment Configuration</h4>
            <ul className='list-disc space-y-1 pl-5'>
              <li>
                <em>Development environment</em>: NODE_ENV=development
                <span className='text-muted-foreground ml-2 block text-sm'>Starts at http://localhost:3000</span>
              </li>
              <li>
                <em>Staging</em>: npm run stg
                <span className='text-muted-foreground ml-2 block text-sm'>
                  Generates a build for staging environment
                </span>
              </li>
              <li>
                <em>Production</em>: npm run prod
                <span className='text-muted-foreground ml-2 block text-sm'>
                  Generates an optimized production build
                </span>
              </li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>📝 Customization</h4>
            <p className='text-muted-foreground text-sm'>
              URL configuration based on environment can be managed in
              <code className='bg-muted mx-1 rounded px-1.5 py-0.5'>src/lib/constants.ts</code>.
            </p>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>📚 Resources</h4>
            <p className='text-muted-foreground text-sm'>
              For detailed documentation, please check
              <a
                href='https://github.com/n-tong009/astro-shadcn-template'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary ml-1 hover:underline'
              >
                GitHub Repository
              </a>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
