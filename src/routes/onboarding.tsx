import { createFileRoute, redirect } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"
import { useUpdateProfile } from "@/hooks/api/use-profile"
import { X, Plus, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react"
import { SENIORITY_LEVELS } from "@/lib/constant"
import { checkClerkAuth } from "@/lib/auth-server"

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
     if (!useAuthStore.getState().isAuthenticated()) {
      throw redirect({ to: "/login" })
    }
  },
  component: OnboardingPage,
})

function OnboardingPage() {
  const updateProfile = useUpdateProfile()

  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("")
  const [seniority, setSeniority] = useState("")
  const [location, setLocation] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [jobTitles, setJobTitles] = useState<string[]>([])
  const [jobTitleInput, setJobTitleInput] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [minSalary, setMinSalary] = useState("")
  const [maxSalary, setMaxSalary] = useState("")

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s))

  const addJobTitle = () => {
    if (jobTitleInput.trim() && !jobTitles.includes(jobTitleInput.trim())) {
      setJobTitles([...jobTitles, jobTitleInput.trim()])
      setJobTitleInput("")
    }
  }

  const removeJobTitle = (t: string) => setJobTitles(jobTitles.filter((x) => x !== t))

  const handleSubmit = () => {
    updateProfile.mutate(
      {
        fullName,
        role,
        seniority,
        location,
        skills,
        jobTitles,
        remotePref: remoteOnly,
        salaryMin: minSalary ? parseInt(minSalary) : undefined,
        salaryMax: maxSalary ? parseInt(maxSalary) : undefined,
      },
      {
        onSuccess: () => {
          window.location.href = "/dashboard"
        },
      }
    )
  }

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d9d9d9]/20 px-4 py-12 dark:bg-[#353535]">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#d9d9d9] dark:bg-[#353535]">
            <div
              className="h-2 rounded-full bg-[#3c6e71] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
                <CardDescription>Tell us a bit about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Current Role</Label>
                  <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label>Seniority</Label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={seniority}
                    onChange={(e) => setSeniority(e.target.value)}
                  >
                    <option value="">Select level</option>
                    {SENIORITY_LEVELS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" />
                </div>
                <Button className="w-full gap-2" onClick={() => setStep(2)} disabled={!fullName || !role || !seniority || !location}>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Add your key technical skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type a skill and press Add"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-full bg-[#3c6e71]/10 px-3 py-1 text-sm text-[#3c6e71]">
                      {s}
                      <button onClick={() => removeSkill(s)} className="hover:text-[#3c6e71]/70">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button className="flex-1 gap-2" onClick={() => setStep(3)} disabled={skills.length === 0}>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Job Titles</CardTitle>
                <CardDescription>What roles are you looking for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={jobTitleInput}
                    onChange={(e) => setJobTitleInput(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addJobTitle())}
                  />
                  <Button type="button" variant="outline" onClick={addJobTitle}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobTitles.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#284b63]/10 px-3 py-1 text-sm text-[#284b63]">
                      {t}
                      <button onClick={() => removeJobTitle(t)} className="hover:text-[#284b63]/70">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button className="flex-1 gap-2" onClick={() => setStep(4)} disabled={jobTitles.length === 0}>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Final touches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-[#d9d9d9]"
                  />
                  <Label htmlFor="remote">Remote only</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Salary</Label>
                    <Input type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} placeholder="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Salary</Label>
                    <Input type="number" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} placeholder="150000" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(3)}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {updateProfile.isPending ? "Saving..." : "Complete Profile"}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
