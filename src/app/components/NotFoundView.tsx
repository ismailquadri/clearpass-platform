import { FileQuestion, Home } from 'lucide-react';

interface NotFoundViewProps {
  onHome: () => void;
}

export function NotFoundView({ onHome }: NotFoundViewProps) {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <FileQuestion className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <p className="text-xl text-muted-foreground mb-2">Page Not Found</p>
          <p className="text-muted-foreground max-w-md mb-8">
            The page you're looking for doesn't exist or has been moved. Check the URL or
            navigate back to your dashboard.
          </p>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-white bg-[#FF3000] hover:bg-[#e62a00] transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
