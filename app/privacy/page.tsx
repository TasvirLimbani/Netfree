import { Navbar } from "@/components/navbar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - NetFree",
  description: "Read our privacy policy to understand how NetFree protects your personal data.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-scale">Privacy Policy</h1>

        <div className="text-gray-300 space-y-6 animate-slide-left">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p>
              NetFree ("we", "us", "our", or "Company") operates the NetFree website and mobile application. This page
              informs you of our policies regarding the collection, use, and disclosure of personal data when you use
              our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service.
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                <strong>Personal Data:</strong> Email address, name, phone number, address, cookies, and usage data
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, and referring page
              </li>
              <li>
                <strong>Device Information:</strong> Device type, browser type, operating system, and IP address
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Use of Data</h2>
            <p>NetFree uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer care and support</li>
              <li>To gather analysis or valuable information for service improvement</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Security of Data</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the
              Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
              means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: privacy@netfree.app</p>
          </section>
        </div>
      </div>
    </main>
  )
}
