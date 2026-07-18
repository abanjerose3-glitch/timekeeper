import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";


function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-extrabold text-slate-800">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-slate-800">
          Page Not Found
        </h2>

        <p className="mt-3 text-slate-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link to="/">
          <Button className="mt-8">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;