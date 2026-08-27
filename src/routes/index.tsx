import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Target, Zap, LogIn } from "lucide-react"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d9d9d9]/30 to-white dark:from-[#353535] dark:to-[#284b63]/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-xl font-bold tracking-tight text-[#353535] dark:text-white">
          Crawler
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="gap-2">
              <Zap className="h-4 w-4" />
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#353535] dark:text-white sm:text-6xl">
            Apply Smarter, <span className="text-[#3c6e71]">Not Harder</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#353535]/70 dark:text-[#d9d9d9]/80">
            AI-powered job matching and resume tailoring. Get a personalized feed
            of jobs ranked by fit, then generate tailored CVs and cover letters
            in seconds.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gap-2 bg-[#3c6e71] hover:bg-[#284b63]">
                <Zap className="h-4 w-4" />
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-[#d9d9d9] dark:border-[#353535]">
              <CardHeader>
                <Target className="h-8 w-8 text-[#3c6e71]" />
                <CardTitle>10-Point Matching</CardTitle>
                <CardDescription>
                  Every job is scored against your profile across skills, title,
                  seniority, location, and recency.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[#d9d9d9] dark:border-[#353535]">
              <CardHeader>
                <Sparkles className="h-8 w-8 text-[#284b63]" />
                <CardTitle>AI Tailoring</CardTitle>
                <CardDescription>
                  Generate a tailored CV and cover letter for any job in
                  seconds. Refine with natural language feedback.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[#d9d9d9] dark:border-[#353535]">
              <CardHeader>
                <Zap className="h-8 w-8 text-[#3c6e71]" />
                <CardTitle>Smart Feed</CardTitle>
                <CardDescription>
                  Your feed learns from your profile. No more scrolling through
                  irrelevant listings.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-12 text-center text-sm text-[#353535]/60 dark:text-[#d9d9d9]/60 sm:px-6 lg:px-8">
        Crawler. Built for job seekers who want an edge.
      </footer>
    </div>
  )
}
