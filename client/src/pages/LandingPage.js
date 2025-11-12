import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TestimonialsSection from '../components/layout/TestimonialsSection'; 
import SimpleNavbar from '../components/layout/SimpleNavbar';
import BackgroundVideo from '../components/common/BackgroundVideo';
import { 
  HeartIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ClockIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  SparklesIcon,
  BoltIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon as StarIconSolid 
} from '@heroicons/react/24/solid';

function LandingPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for individuals getting started',
      features: [
        'Up to 5 appointments per month',
        'Basic health records',
        'Email support',
        'Mobile app access',
        'Basic analytics'
      ],
      notIncluded: [
        'Priority support',
        'Advanced analytics',
        'Custom integrations'
      ],
      highlighted: false,
      cta: 'Get Started'
    },
    {
      name: 'Professional',
      price: '$49',
      period: 'per month',
      description: 'For healthcare professionals',
      features: [
        'Unlimited appointments',
        'Advanced health records',
        'Priority support 24/7',
        'Mobile & web app access',
        'Advanced analytics & reports',
        'Custom branding',
        'API access',
        'Team collaboration'
      ],
      notIncluded: [
        'Custom integrations',
        'Dedicated account manager'
      ],
      highlighted: true,
      badge: 'Most Popular',
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large healthcare organizations',
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Advanced security features',
        'Custom workflows',
        'Training & onboarding',
        'White-label options'
      ],
      notIncluded: [],
      highlighted: false,
      cta: 'Contact Sales'
    }
  ];

  const trustIndicators = [
    { name: 'HIPAA Compliant', icon: ShieldCheckIcon },
    { name: 'ISO 27001 Certified', icon: CheckCircleIconSolid },
    { name: 'SOC 2 Type II', icon: StarIconSolid },
    { name: '99.9% Uptime', icon: BoltIcon }
  ];

  const features = [
    {
      icon: HeartIcon,
      title: 'Patient Care',
      description: 'Comprehensive patient management system with appointment scheduling and medical records.'
    },
    {
      icon: UserGroupIcon,
      title: 'Doctor Network',
      description: 'Connect with specialized healthcare professionals across various medical fields.'
    },
    {
      icon: CalendarIcon,
      title: 'Easy Scheduling',
      description: 'Book, manage, and track appointments with intuitive calendar integration.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with HIPAA-compliant data protection standards.'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Real-time insights and reporting for healthcare administrators.'
    },
    {
      icon: ClockIcon,
      title: '24/7 Access',
      description: 'Access your health records and book appointments anytime, anywhere.'
    }
  ];

  const stats = [
    { label: 'Active Patients', value: '10,000+' },
    { label: 'Healthcare Providers', value: '500+' },
    { label: 'Appointments Booked', value: '50,000+' },
    { label: 'Customer Satisfaction', value: '98%' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'This system has made managing my healthcare so much easier. Booking appointments is seamless!',
      avatar: 'SJ'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      content: 'As a doctor, this platform helps me manage my schedule efficiently and focus on patient care.',
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Healthcare Admin',
      content: 'The analytics and management tools are exceptional. It has streamlined our entire operation.',
      avatar: 'ER'
    },
    {
      name: 'James Patel',
      role: 'Patient',
      content: 'I can easily check my upcoming appointments and reminders. The app gives me peace of mind.',
      avatar: 'JP'
    },
    {
      name: 'Dr. Aisha Khan',
      role: 'Dermatologist',
      content: 'With the online consultation feature, I can reach more patients without compromising on care.',
      avatar: 'AK'
    },
    {
      name: 'Linda Garcia',
      role: 'Nurse',
      content: 'Updating patient records and sharing them with doctors has never been this smooth.',
      avatar: 'LG'
    },
    {
      name: 'Mark Thompson',
      role: 'Healthcare IT Manager',
      content: 'The integration with our hospital systems was flawless. Security and compliance are top-notch.',
      avatar: 'MT'
    },
    {
      name: 'Rachel Kim',
      role: 'Patient',
      content: 'I love the reminders! I never forget to take my medication or attend an appointment now.',
      avatar: 'RK'
    }
  ];

  return (
    <div className="min-h-screen relative">

      <SimpleNavbar />

      {/* HERO SECTION WITH VIDEO */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <BackgroundVideo />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 text-center py-24 sm:py-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <SparklesIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trusted by 10,000+ Healthcare Professionals
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Healthcare Management
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
              Made Simple
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            A comprehensive platform connecting patients, doctors, and healthcare administrators
            for seamless medical care management and appointment scheduling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4 rounded-xl shadow-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* == NOTHING BELOW THIS CHANGED == */}

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="card text-center p-6 hover:shadow-xl transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage healthcare services efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SparklesIcon className="h-6 w-6 text-primary dark:text-primary-dark" />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Create Account</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up as a patient, doctor, or administrator in seconds
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Complete Profile</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add your details and preferences to personalize your experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Start Managing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Book appointments, manage records, and track your health
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Watch how easy it is to manage your healthcare
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative aspect-video">
            <video
              className="w-full h-full object-cover rounded-2xl"
              src="/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose the plan that's right for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card p-8 relative ${
                  plan.highlighted
                    ? 'ring-2 ring-primary dark:ring-primary-dark shadow-2xl transform scale-105'
                    : 'hover:shadow-xl'
                } transition-all duration-300`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full">
                      <span className="text-white text-sm font-semibold">{plan.badge}</span>
                    </div>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-success dark:text-success-dark flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 opacity-50">
                      <XMarkIcon className="h-5 w-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      {/* Newsletter */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 sm:p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary-dark/5 dark:to-secondary-dark/5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-6">
              <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Subscribe to our newsletter for the latest updates, tips, and healthcare insights
            </p>
            {!subscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 input-field"
                  />
                  <button
                    type="submit"
                    className="btn-primary whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-success dark:text-success-dark">
                <CheckCircleIconSolid className="h-6 w-6" />
                <span className="font-medium">Thank you for subscribing!</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-12">
            Join thousands of users managing their healthcare efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-2"
            >
              <SparklesIcon className="h-5 w-5" />
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface dark:bg-surface-dark py-12 border-t border-border dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">HealthCare</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Modern healthcare management for the digital age
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>1-800-HEALTH</span>
                </li>
                <li className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span>support@healthcare.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} Healthcare Management System. All rights reserved. <br />
              Developed by{' '}
              <a
                href="https://github.com/Skywalker690"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary dark:text-primary-dark hover:underline"
              >
                Skywalker690 ❤️
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
