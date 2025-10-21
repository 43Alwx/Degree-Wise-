import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Degree Wise - Your Graduation Planner</title>
        <meta name="description" content="Smart graduation planning for CS students at MSU Denver" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen">
        {/* Header */}
        <header className="w-full max-w-7xl mx-auto px-5 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DW</span>
            </div>
            <h1 className="text-2xl font-display text-primary">Degree Wise</h1>
          </div>
          <nav className="flex gap-6">
            <Link href="/courses" className="text-primary hover:text-accent transition-colors">Courses</Link>
            <Link href="#features" className="text-primary hover:text-accent transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-primary hover:text-accent transition-colors">How It Works</Link>
            <Link href="#about" className="text-primary hover:text-accent transition-colors">About</Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden mb-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary opacity-90"></div>
          <div className="relative z-10 text-center px-5 max-w-4xl">
            <h2 className="text-6xl md:text-7xl font-display text-white mb-6 drop-shadow-lg">
              Plan Your Path to Graduation
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-sans">
              The smart graduation planner for Computer Science students at MSU Denver
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-lg">
                Get Started
              </Link>
              <button className="btn-secondary text-lg">
                Learn More
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-5 py-20">
          <h3 className="text-4xl font-display text-primary text-center mb-12">
            Everything You Need to Graduate on Time
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📸"
              title="Transcript Upload"
              description="Simply take a photo of your transcript or manually enter your completed courses"
            />
            <FeatureCard
              icon="✅"
              title="Smart Prerequisites"
              description="Automatically checks which courses you can take based on what you've completed"
            />
            <FeatureCard
              icon="📅"
              title="Graduation Timeline"
              description="See exactly when you'll graduate with different course load scenarios"
            />
            <FeatureCard
              icon="🎯"
              title="Course Recommendations"
              description="Get personalized suggestions for what to take next semester"
            />
            <FeatureCard
              icon="📊"
              title="Progress Tracking"
              description="Visualize your journey with clear progress indicators"
            />
            <FeatureCard
              icon="🎓"
              title="MSU Denver Specific"
              description="Built specifically for CS majors with real course data"
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white/50 py-20">
          <div className="max-w-7xl mx-auto px-5">
            <h3 className="text-4xl font-display text-primary text-center mb-12">
              How It Works
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              <StepCard number="1" title="Upload Transcript" description="Take a photo or enter your completed courses manually" />
              <StepCard number="2" title="Review Progress" description="See what requirements you've completed" />
              <StepCard number="3" title="Plan Ahead" description="Explore different graduation timeline scenarios" />
              <StepCard number="4" title="Register Smart" description="Know exactly what to take next semester" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-5 py-20 text-center">
          <h3 className="text-5xl font-display text-primary mb-6">
            Ready to Plan Your Future?
          </h3>
          <p className="text-xl text-primary-light mb-8 font-sans">
            Join fellow MSU Denver CS students who are taking control of their graduation timeline
          </p>
          <Link href="/dashboard" className="btn-primary text-lg">
            Start Planning Now
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-primary text-white py-8">
          <div className="max-w-7xl mx-auto px-5 text-center">
            <p className="font-sans">Built with ❤️ for MSU Denver CS Students</p>
            <p className="text-sm text-white/70 mt-2">Degree Wise - Smart Graduation Planning</p>
          </div>
        </footer>
      </main>
    </>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h4 className="text-xl font-sans font-bold text-primary mb-2">{title}</h4>
      <p className="text-primary-light">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-2xl">{number}</span>
      </div>
      <h4 className="text-xl font-sans font-bold text-primary mb-2">{title}</h4>
      <p className="text-primary-light">{description}</p>
    </div>
  )
}
