import React from 'react'
import { Link } from 'react-router-dom'
import { Film, Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
        <Film className="w-8 h-8" />
      </div>

      <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1">
        Error 404
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#f3f4f6] font-display mb-2">
        Frame Not Found
      </h1>
      <p className="text-xs sm:text-sm text-[#9da3b4] max-w-sm mb-6 leading-relaxed">
        The archive chapter or frame you are looking for does not exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Home className="w-4 h-4" />}
          >
            Back to Home
          </Button>
        </Link>
        <button onClick={() => window.history.back()} className="cursor-pointer">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
        </button>
      </div>
    </div>
  )
}
